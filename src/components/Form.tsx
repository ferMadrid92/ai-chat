import React from 'react'
import { useAppStore } from '../stores/useAppStore'
import { MODELS } from '../lib/models'

export default function Form() {

    const generateResponse = useAppStore(state => state.generateResponse)
    const showNotification = useAppStore(state => state.showNotification)
    const isGenerating = useAppStore(state => state.isGenerating)
    const response = useAppStore(state => state.response)
    const reasoning = useAppStore((s) => s.reasoning)

    const model = useAppStore(state => state.model)
    const setModel = useAppStore(state => state.setModel)
    const useReasoning = useAppStore((s) => s.useReasoning);
    const setUseReasoning = useAppStore((s) => s.setUseReasoning);

    // Selected model supports reasoning?
    const modelObj = MODELS.find((m) => m.id === model);
    const supportsReasoning = modelObj?.reasoning ?? false;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const prompt = form.get('prompt') as string

        if (prompt.trim() === '') {
            showNotification({
                text: 'Please enter a prompt',
                error: true
            })
            return
        }
        await generateResponse(prompt)
    }

  return (
    <>
        <div className="container max-w-4xl mx-auto">
          <form  
            onSubmit={handleSubmit}
            className='flex flex-col space-y-3 py-10 px-4 md:px-0 '
          >

              <label htmlFor="model" className="block mb-1 font-medium">Model</label>
              <select
                id="model"
                name="model"
                className="border rounded-lg p-2 w-1/2 mb-2 "
                value={model}
                onChange={e => setModel(e.target.value)}
                disabled={isGenerating}
              >
                {MODELS.map(m => (
                  <option className='bg-black' key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

        {/* Show only if reasoning is supported */}
        {supportsReasoning && (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useReasoning}
              onChange={(e) => setUseReasoning(e.target.checked)}
              disabled={isGenerating}
            />
            <span>Reasoning Enabled</span>
          </label>
        )}

              <textarea 
                name="prompt" 
                id="prompt" 
                className="border bg-zinc-900 p-4 rounded-lg w-full border-slate-800 h-36 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none" 
                placeholder="Ask me anything..."
                autoComplete="off"
              />

              <input 
                type="submit" 
                aria-label="Generate"
                className={`bg-slate-500 inline-block lg:ml-auto text-white text-sm uppercase font-bold  rounded-sm py-2 w-full md:w-1/4 cursor-pointer ${isGenerating ? 'cursor-not-allowed opacity-50 animate-blink' : 'hover:bg-slate-700'}`}
                disabled={isGenerating}
                value={isGenerating ? 'Generating...' : 'Send' }
              />

          </form>

        {reasoning && (
          <div className="bg-gray-600 p-4 mb-4 rounded">
            <h3 className="font-semibold mb-2">Reasoning:</h3>
            <pre className="whitespace-pre-wrap text-sm">{reasoning}</pre>
          </div>
        )}

          <div className="py-10 px-4 md:px-0 whitespace-pre-wrap">
            {response}
          </div>

        </div>
    </>
  )
}
