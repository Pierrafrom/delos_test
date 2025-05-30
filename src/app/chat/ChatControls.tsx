'use client'

import {FC} from 'react'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

interface ChatControlsProps {
    inputValue: string
    onInputChangeAction: (value: string) => void
    onSendAction: () => void
    onStopAction: () => void
    loading: boolean
    placeholder?: string
}

/**
 * Renders the message input box plus Send / Stop buttons.
 */
export const ChatControls: FC<ChatControlsProps> = ({
                                                        inputValue,
                                                        onInputChangeAction,
                                                        onSendAction,
                                                        onStopAction,
                                                        loading,
                                                        placeholder = 'Entrez votre message…',
                                                    }) => (
    <form
        onSubmit={e => {
            e.preventDefault()
            onSendAction()
        }}
        className="flex gap-2 items-center"
    >
        <Input
            className="flex-1"
            placeholder={placeholder}
            value={inputValue}
            onChange={e => onInputChangeAction(e.currentTarget.value)}
            disabled={loading}
            onKeyDown={e => {
                if (e.key === 'Enter' && !loading && inputValue.trim()) {
                    e.preventDefault()
                    onSendAction()
                }
            }}
        />
        {loading ? (
            <Button variant="destructive" onClick={onStopAction}>Stop</Button>
        ) : (
            <Button type="submit" disabled={!inputValue.trim()}>Envoyer</Button>
        )}
    </form>
)
