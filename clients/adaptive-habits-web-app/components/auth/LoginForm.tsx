'use client'

import { startTransition, useActionState, useEffect, useState } from 'react'
import { loginAction } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const initialState = {error: ''}

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (state?.error) {
            setErrorMessage(state.error)
        }
    }, [state])

    const handleInput = () => {
        if (errorMessage) setErrorMessage('')
    }

    return (
        <form action={formAction} className="space-y-6">
            {errorMessage && (
                <div className="bg-red-300 text-bg-dark text-sm p-3 rounded-md text-center">
                    {errorMessage}
                </div>
            )}

            <Input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                onChange={handleInput}
                placeholder="Username"
            />

            <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                onChange={handleInput}
                placeholder="Password"
            />

            <Button type="submit" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>
        </form>
    )
}
