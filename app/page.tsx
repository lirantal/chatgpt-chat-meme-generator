"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Menu, Edit, Copy, ThumbsUp, ThumbsDown, Volume2, Share, RotateCcw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"

const models = [
  "ChatGPT 3.5",
  "ChatGPT 4",
  "ChatGPT 4 Turbo",
  "ChatGPT 5 Pro",
  "Claude 3.5 Sonnet",
  "Gemini Pro",
  "GPT-4o",
  "Custom",
]

const memeTemplates = [
  {
    id: "custom",
    name: "Custom",
    userMessage: "",
    aiResponse: "",
  },
  {
    id: "secure-code",
    name: "Secure Code",
    userMessage: "Can LLM generate secure code?",
    aiResponse: "No",
  },
  {
    id: "sun-rise",
    name: "Sun Rise",
    userMessage: "Will the sun rise tomorrow?",
    aiResponse: "Yes",
  },
  {
    id: "rx-5090",
    name: "RX 5090 Pi",
    userMessage: "How do I install an RX 5090 on a Raspberry Pi?",
    aiResponse: "You can't",
  },
]

export default function ChatGPTMemeGenerator() {
  const [selectedModel, setSelectedModel] = useState("ChatGPT 5 Pro")
  const [customModelName, setCustomModelName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("custom")
  const [userMessage, setUserMessage] = useState("How do I install Fortnite on Mac?")
  const [thinkingTime, setThinkingTime] = useState("69m 42s")
  const [aiResponse, setAiResponse] = useState("You can't.")
  const chatRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const getDisplayModelName = () => {
    return selectedModel === "Custom" ? customModelName || "Custom Model" : selectedModel
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = memeTemplates.find((t) => t.id === templateId)
    if (template && templateId !== "custom") {
      setUserMessage(template.userMessage)
      setAiResponse(template.aiResponse)
    }
  }

  const downloadAsImage = async () => {
    if (!chatRef.current) return

    try {
      const canvas = await html2canvas(chatRef.current, {
        backgroundColor: "#1f1f1f",
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = "chatgpt-meme.png"
      link.href = canvas.toDataURL()
      link.click()

      toast({
        title: "Downloaded!",
        description: "Your ChatGPT meme has been saved as an image.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    if (!chatRef.current) return

    try {
      const canvas = await html2canvas(chatRef.current, {
        backgroundColor: "#1f1f1f",
        scale: 2,
        useCORS: true,
      })

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
          toast({
            title: "Copied!",
            description: "ChatGPT meme copied to clipboard.",
          })
        }
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ChatGPT Meme Generator</h1>
          <p className="text-gray-600">Create funny ChatGPT conversation memes</p>
        </div>

        {/* Controls */}
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meme Template</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {memeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">AI Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModel === "Custom" && (
                <Input
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="Enter custom model name..."
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thinking Time</label>
              <Input
                value={thinkingTime}
                onChange={(e) => setThinkingTime(e.target.value)}
                placeholder="e.g., 69m 42s"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">User Message</label>
            <Textarea
              value={userMessage}
              onChange={(e) => {
                setUserMessage(e.target.value)
                if (selectedTemplate !== "custom") {
                  setSelectedTemplate("custom")
                }
              }}
              placeholder="Enter the user's question..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AI Response</label>
            <Textarea
              value={aiResponse}
              onChange={(e) => {
                setAiResponse(e.target.value)
                if (selectedTemplate !== "custom") {
                  setSelectedTemplate("custom")
                }
              }}
              placeholder="Enter the AI's response..."
              rows={3}
            />
          </div>
        </Card>

        {/* Preview */}
        <div className="flex justify-center">
          <div ref={chatRef} className="w-full max-w-2xl bg-[#1f1f1f] text-white rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Menu className="w-6 h-6 text-gray-400" />
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">{getDisplayModelName()}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <Edit className="w-6 h-6 text-gray-400" />
            </div>

            {/* Chat Content */}
            <div className="p-6 space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-[#2f2f2f] rounded-2xl px-4 py-3 max-w-xs">
                  <p className="text-white whitespace-pre-wrap">{userMessage}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="space-y-3">
                <div className="text-gray-400 text-sm">Thought for {thinkingTime}</div>
                <div className="text-white whitespace-pre-wrap">{aiResponse}</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <ThumbsUp className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <ThumbsDown className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <Volume2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <Share className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                <RotateCcw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">S</span>
                  </div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">W</span>
                  </div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">P</span>
                  </div>
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">R</span>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Sources</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download/Copy Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={downloadAsImage} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </Button>
          <Button onClick={copyToClipboard} variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Copy className="w-4 h-4" />
            <span>Copy to Clipboard</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
