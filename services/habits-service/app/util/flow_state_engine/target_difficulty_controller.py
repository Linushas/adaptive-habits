import numpy as np

from app.util.flow_state_engine.config import params
from app.util.flow_state_engine.data_classes import DataPoint, History, ControllerState


# notebooks/experiments/01_exploring.ipynb
class TargetDifficultyController:
    def __init__(self, history: History):
        self.history = history
        self.state = ControllerState(
            level=history.data_points[0].value,
            trend=(
                history.data_points[1].value - history.data_points[0].value
                if (len(history.data_points) > 1)
                else 0.0
            ),
            target=history.data_points[0].target,
            streak=0
        )
        
    
    def get_next_target(self) -> float:
        data_points = self.history.data_points
        for i in range(1, len(data_points)):
            self.state = TargetDifficultyController.next_state(self.state, data_points[i].value)
        
        return self.state.target

    @staticmethod
    def next_state(state: ControllerState, value: float) -> ControllerState:
        target = state.target
        streak = state.streak
        level, trend, next_holt = TargetDifficultyController.holts_linear_trend(
            state.level, state.trend, value
        )

        if value < target * params.TREND_RESET_COEFFICIENT:
            trend = trend * params.TREND_DAMPING
            next_holt = level

        is_success = value >= target
        if is_success:
            k = TargetDifficultyController.elasticity_above_sigmoid(streak)
            streak += 1
        else:
            k = TargetDifficultyController.elasticity_below_linear(streak)
            streak = 0

        cap = target * params.VALUE_INCREASE_CAP
        if value > cap:
            value = cap

        next_target = TargetDifficultyController.target_rubber_band(
            next_holt,
            value,
            target,
            k,
            k,
            params.MAX_TARGET_INCREASE,
            params.MAX_TARGET_DECREASE,
        )

        new_state = ControllerState(
            level = level,
            streak = streak,
            trend = trend,
            target = next_target
        )
        return new_state

    @staticmethod
    def holts_linear_trend(
        old_level: float,
        old_trend: float,
        value: float,
        alpha: float = params.HLT_ALPHA,
        beta: float = params.HLT_BETA,
    ):
        level = alpha * value + (1 - alpha) * (old_level + old_trend)
        trend = beta * (level - old_level) + (1 - beta) * old_trend
        forecast = level + trend
        return level, trend, forecast

    @staticmethod
    def target_rubber_band(
        h: float,
        value: float,
        old_target: float,
        k_above: float,
        k_below: float,
        max_increase: float,
        max_decrease: float,
    ) -> float:
        completion: float = value - old_target
        completion_percentage: float = (
            (completion / old_target) if old_target > 0 else 0.0
        )
        k = k_above if completion_percentage >= 0 else k_below

        new_target = h * (1 + k * completion_percentage)

        upper_boundary = old_target * (1 + max_increase)
        lower_boundary = old_target * (1 - max_decrease)

        target = max(lower_boundary, min(new_target, upper_boundary))

        return max(max(params.MIN_TARGET, params.TREND_DAMPING * h), target)

    @staticmethod
    def elasticity_above_sigmoid(
        streak: int,
        k_max: float = params.ELASTICITY_ABOVE_MAX,
        k_min: float = params.ELASTICITY_ABOVE_MIN,
        inflection_point_days: int = params.ELASTICITY_ABOVE_INFLECTION_POINT_DAYS,
    ) -> float:
        steepness = params.ELASTICITY_ABOVE_SIGMOID_STEEPNESS
        sigmoid_factor = 1 / (1 + np.exp(-steepness * (streak - inflection_point_days)))
        return k_max - (k_max - k_min) * sigmoid_factor

    @staticmethod
    def elasticity_below_linear(
        streak: int,
        k_max: float = params.ELASTICITY_BELOW_MAX,
        k_min: float = params.ELASTICITY_BELOW_MIN,
        threshold_days: int = params.ELASTICITY_BELOW_STREAK_THRESHOLD_DAYS,
    ) -> float:
        if streak <= 1:
            return k_max
        if streak >= threshold_days:
            return k_min
        ratio = streak / threshold_days
        return k_max - (ratio * (k_max - k_min))
