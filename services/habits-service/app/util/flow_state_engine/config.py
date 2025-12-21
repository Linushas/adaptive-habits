class Params:
    MIN_TARGET = 2.0

    VALUE_INCREASE_CAP: float = 1.5
    MAX_TARGET_INCREASE: float = 1.1
    MAX_TARGET_DECREASE: float = 0.9

    # Holt's Linear Trend
    HLT_ALPHA: float = 0.1
    HLT_BETA: float = 0.1

    # Rubber Banding
    ELASTICITY_ABOVE_INFLECTION_POINT_DAYS: int = 14
    ELASTICITY_ABOVE_SIGMOID_STEEPNESS: float = 0.3
    ELASTICITY_BELOW_STREAK_THRESHOLD_DAYS: int = 21
    ELASTICITY_ABOVE_MAX: float = 0.4
    ELASTICITY_ABOVE_MIN: float = 0.05
    ELASTICITY_BELOW_MAX: float = 0.9
    ELASTICITY_BELOW_MIN: float = 0.2


params = Params()
