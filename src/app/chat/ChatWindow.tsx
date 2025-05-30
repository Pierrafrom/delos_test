'use client'

import React, {FC} from 'react'
import {Card, CardContent} from '@/components/ui/card'
import {Edit2Icon, StopCircle} from 'lucide-react'
import {Button} from '@/components/ui/button'

/** Single chat message */
export type ChatMessage = { from: 'user' | 'ai'; text: string }

interface ChatWindowProps {
    messages: ChatMessage[]
    editIndex: number | null
    editText: string
    onEditAction: (index: number) => void
    onEditTextChangeAction: (text: string) => void
    onSaveEditAction: (index: number) => void
    onCancelEditAction: () => void
    loading: boolean
    scrollRef: React.RefObject<HTMLDivElement | null>
}

/**
 * Renders the scrollable chat bubbles and handles edit mode.
 */
export const ChatWindow: FC<ChatWindowProps> = ({
                                                    messages,
                                                    editIndex,
                                                    editText,
                                                    onEditAction,
                                                    onEditTextChangeAction,
                                                    onSaveEditAction,
                                                    onCancelEditAction,
                                                    loading,
                                                    scrollRef,
                                                }) => (
    <Card className="h-[400px] overflow-y-auto bg-muted rounded-2xl px-4 py-2 space-y-3">
        <CardContent className="space-y-3 pt-4">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                        msg.from === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'
                    }`}
                >
                    {editIndex === i ? (
                        <>
              <textarea
                  rows={3}
                  className="w-full p-2 rounded text-black"
                  value={editText}
                  onChange={e => onEditTextChangeAction(e.currentTarget.value)}
                  onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          onSaveEditAction(i)
                      }
                  }}
              />
                            <div className="flex justify-end space-x-2 mt-2">
                                <Button size="sm" onClick={() => onSaveEditAction(i)}>Valider</Button>
                                <Button size="sm" variant="secondary" onClick={onCancelEditAction}>Annuler</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span>{msg.text}</span>
                            {msg.from === 'user' && (
                                <button onClick={() => onEditAction(i)} className="p-1" title="Modifier">
                                    <Edit2Icon className="w-4 h-4 text-white"/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {loading && (
                <div className="flex items-center space-x-2">
                    <StopCircle className="w-5 h-5 text-gray-500"/>
                    <span className="text-sm italic text-muted-foreground">L’IA écrit…</span>
                </div>
            )}

            <div ref={scrollRef}/>
        </CardContent>
    </Card>
)
