"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  MessageSquarePlus,
  Mic,
  MicOff,
  Plus,
  Send,
  Settings,
  Stethoscope,
  User,
  Zap,
  X,
  ChevronLeftIcon as ChevronDoubleLeft,
  Save,
  Volume2,
  PlusCircle,
  Phone,
  Hospital,
  Pill,
  BookOpen,
  Link2,
  Newspaper,
} from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

type Screen =
  | "chat"
  | "create-assistant"
  | "speech-to-speech"
  | "emergency-call"
  | "find-hospital"
  | "call-doctor"
  | "identify-drugs"
  | "health-guide"
  | "connect-devices"
  | "health-news"

interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
}

interface Assistant {
  id: string
  name: string
  specialty: string
  personality: string
}

export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<Screen>("chat")
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom Assistant state
  const [createdAssistants, setCreatedAssistants] = useState<Assistant[]>([])
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null)
  const [assistantName, setAssistantName] = useState("")
  const [assistantSpecialty, setAssistantSpecialty] = useState("")
  const [assistantPersonality, setAssistantPersonality] = useState("")

  // Define the default Health Buddy assistant
  const defaultHealthBuddy: Assistant = {
    id: "default-health-buddy",
    name: "Health Buddy",
    specialty: "General Wellness",
    personality: "Friendly and helpful",
  }

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize with default Health Buddy if no assistants are set
    if (createdAssistants.length === 0 && !currentAssistant) {
      setCreatedAssistants([defaultHealthBuddy])
      setCurrentAssistant(defaultHealthBuddy)
      // Remove the setMessages call so the initial UI shows
    }
  }, []) // Run only once on mount

  const handleCreateAssistant = () => {
    const newAssistant: Assistant = {
      id: Date.now().toString(),
      name: assistantName || "My Health Assistant",
      specialty: assistantSpecialty,
      personality: assistantPersonality,
    }
    setCreatedAssistants((prev) => [...prev, newAssistant])
    setCurrentAssistant(newAssistant)
    // Remove the setMessages call so the initial UI shows
    setAssistantName("")
    setAssistantSpecialty("")
    setAssistantPersonality("")
    setCurrentScreen("chat")
  }

  const handleSelectAssistant = (assistant: Assistant) => {
    setCurrentAssistant(assistant)
    // Remove the setMessages call so the initial UI shows
    setCurrentScreen("chat")
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage.trim(),
    }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputMessage("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: `Thanks for your message! As your ${currentAssistant?.specialty || "health"} assistant, I'm processing "${newUserMessage.text}". How else can I assist you?`,
      }
      setMessages((prevMessages) => [...prevMessages, assistantResponse])
    }, 1000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Add speech recognition logic here
  }

  const renderCreateAssistantScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900">Create Your Personal Health Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assistant-name">Assistant Name</Label>
            <Input
              id="assistant-name"
              placeholder="e.g., Dr. Sarah, HealthBot, My Wellness Coach"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty Focus</Label>
            <Input
              id="specialty"
              placeholder="e.g., Nutrition, Mental Health, Fitness, General Wellness"
              value={assistantSpecialty}
              onChange={(e) => setAssistantSpecialty(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Personality & Approach</Label>
            <Textarea
              id="personality"
              placeholder="Describe how you want your assistant to communicate (e.g., friendly and encouraging, professional and direct, empathetic and supportive)"
              value={assistantPersonality}
              onChange={(e) => setAssistantPersonality(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateAssistant} className="flex-1 bg-[#5dade2] hover:bg-[#4a9bd1] text-white">
              <Save className="w-4 h-4 mr-2" />
              Create Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSpeechToSpeechScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900">Voice Chat with Health Buddy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 border-none">
          <div className="text-center space-y-4">
            <div
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording ? "bg-red-100 animate-pulse" : "bg-[#5dade2]/10"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording ? "bg-red-500" : "bg-[#5dade2]"
                }`}
              >
                {isRecording ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">{isRecording ? "Listening..." : "Tap to speak"}</h3>
              <p className="text-gray-600 text-sm">
                {isRecording
                  ? "Speak clearly about your health concerns"
                  : "Start a voice conversation with your health assistant"}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setCurrentScreen("chat")}>
              <X className="w-4 h-4 mr-2" />
              Exit Voice Chat
            </Button>
            <Button
              onClick={toggleRecording}
              className={`${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#5dade2] hover:bg-[#4a9bd1]"} text-white`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {/* Simulated conversation history */}
          <div className="space-y-3 max-h-40 overflow-y-auto">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="w-4 h-4 text-[#5dade2]" />
                <span className="text-sm font-medium">Health Buddy</span>
              </div>
              <p className="text-sm">Hello! How can I help you with your health today?</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEmergencyCallScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-red-600 flex items-center justify-center gap-2">
            <Phone className="w-8 h-8" />
            Emergency Call
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <Phone className="w-10 h-10 text-white" />
              </div>
            </div>
            <p className="text-gray-600">In case of emergency, call these numbers immediately:</p>
          </div>

          <div className="grid gap-4">
            <Button className="h-16 text-lg bg-red-500 hover:bg-red-600 text-white">
              <Phone className="w-6 h-6 mr-3" />
              Call 911 - Emergency Services
            </Button>
            <Button className="h-16 text-lg bg-blue-500 hover:bg-blue-600 text-white">
              <Phone className="w-6 h-6 mr-3" />
              Call Poison Control: 1-800-222-1222
            </Button>
            <Button className="h-16 text-lg bg-green-500 hover:bg-green-600 text-white">
              <Phone className="w-6 h-6 mr-3" />
              Call Crisis Hotline: 988
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Information:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Stay calm and speak clearly</li>
              <li>• Provide your exact location</li>
              <li>• Describe the emergency situation</li>
              <li>• Follow the operator's instructions</li>
            </ul>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderFindHospitalScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <Hospital className="w-8 h-8" />
            Find Hospital Near Me
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Input placeholder="Enter your location or ZIP code" className="flex-1" />
            <Button className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">Search</Button>
          </div>

          <div className="grid gap-4">
            {[
              {
                name: "City General Hospital",
                distance: "0.8 miles",
                rating: "4.5",
                phone: "(555) 123-4567",
                emergency: true,
              },
              {
                name: "St. Mary's Medical Center",
                distance: "1.2 miles",
                rating: "4.3",
                phone: "(555) 234-5678",
                emergency: true,
              },
              {
                name: "Regional Health Clinic",
                distance: "2.1 miles",
                rating: "4.1",
                phone: "(555) 345-6789",
                emergency: false,
              },
            ].map((hospital, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{hospital.name}</h3>
                  {hospital.emergency && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Emergency</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>📍 {hospital.distance}</span>
                  <span>⭐ {hospital.rating}/5</span>
                  <span>📞 {hospital.phone}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    Call Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCallDoctorScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <User className="w-8 h-8" />
            Call a Doctor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Available Doctors</h3>
              {[
                { name: "Dr. Sarah Johnson", specialty: "General Practice", available: "Now", rating: "4.8" },
                { name: "Dr. Michael Chen", specialty: "Cardiology", available: "15 min", rating: "4.9" },
                { name: "Dr. Emily Davis", specialty: "Pediatrics", available: "30 min", rating: "4.7" },
              ].map((doctor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Available {doctor.available}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">⭐ {doctor.rating}/5</span>
                    <Button size="sm" className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">
                      Call Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Consultation</h3>
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <Label htmlFor="symptoms">Describe your symptoms</Label>
                  <Textarea id="symptoms" placeholder="Tell us what you're experiencing..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Low - Can wait a few days</option>
                    <option>Medium - Need consultation today</option>
                    <option>High - Need immediate attention</option>
                  </select>
                </div>
                <Button className="w-full bg-[#5dade2] hover:bg-[#4a9bd1] text-white">Request Consultation</Button>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderIdentifyDrugsScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <Pill className="w-8 h-8" />
            Identify Drugs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Search Methods</h3>
              <div className="space-y-3">
                <Button className="w-full h-16 bg-[#5dade2] hover:bg-[#4a9bd1] text-white flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📷</div>
                  Take Photo of Pill
                </Button>
                <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-3 bg-transparent">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">🔍</div>
                  Search by Name
                </Button>
                <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-3 bg-transparent">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">📝</div>
                  Describe Pill
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Manual Search</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="pill-name">Pill Name or Imprint</Label>
                  <Input id="pill-name" placeholder="e.g., Tylenol, 325, etc." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <select id="color" className="w-full p-2 border rounded-md">
                      <option>Select color</option>
                      <option>White</option>
                      <option>Blue</option>
                      <option>Red</option>
                      <option>Yellow</option>
                      <option>Green</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="shape">Shape</Label>
                    <select id="shape" className="w-full p-2 border rounded-md">
                      <option>Select shape</option>
                      <option>Round</option>
                      <option>Oval</option>
                      <option>Square</option>
                      <option>Capsule</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-[#5dade2] hover:bg-[#4a9bd1] text-white">Search Database</Button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Warning:</h3>
            <p className="text-sm text-yellow-700">
              This tool is for informational purposes only. Always consult with a healthcare professional before taking
              any medication. Never take unidentified pills.
            </p>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthGuideScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" />
            Health Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "First Aid",
                icon: "🏥",
                topics: ["CPR Basics", "Wound Care", "Burns Treatment", "Choking Response"],
              },
              {
                title: "Nutrition",
                icon: "🥗",
                topics: ["Balanced Diet", "Vitamins Guide", "Meal Planning", "Food Safety"],
              },
              {
                title: "Exercise",
                icon: "💪",
                topics: ["Workout Plans", "Stretching", "Cardio Tips", "Strength Training"],
              },
              {
                title: "Mental Health",
                icon: "🧠",
                topics: ["Stress Management", "Sleep Hygiene", "Meditation", "Anxiety Help"],
              },
              {
                title: "Preventive Care",
                icon: "🛡️",
                topics: ["Vaccinations", "Health Screenings", "Check-up Schedule", "Risk Factors"],
              },
              {
                title: "Chronic Conditions",
                icon: "📋",
                topics: ["Diabetes Care", "Heart Health", "Arthritis", "Hypertension"],
              },
            ].map((category, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="text-sm text-gray-600 hover:text-[#5dade2] cursor-pointer">
                      • {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Featured Article</h3>
            <p className="text-blue-700 mb-2">
              "10 Essential Health Tips for a Better Life" - Learn simple daily habits that can significantly improve
              your overall health and wellbeing.
            </p>
            <Button size="sm" className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">
              Read More
            </Button>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderConnectDevicesScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <Link2 className="w-8 h-8" />
            Connect Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">Connect your health devices to track your wellness data</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Fitness Tracker", icon: "⌚", status: "Connected", data: "Steps: 8,432 | Heart Rate: 72 bpm" },
              { name: "Smart Scale", icon: "⚖️", status: "Not Connected", data: "Last sync: Never" },
              { name: "Blood Pressure Monitor", icon: "🩺", status: "Connected", data: "Last reading: 120/80 mmHg" },
              { name: "Glucose Monitor", icon: "🩸", status: "Not Connected", data: "Last sync: Never" },
            ].map((device, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{device.icon}</span>
                    <div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm text-gray-600">{device.data}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      device.status === "Connected" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
                <Button
                  size="sm"
                  className={
                    device.status === "Connected"
                      ? "bg-gray-500 hover:bg-gray-600 text-white"
                      : "bg-[#5dade2] hover:bg-[#4a9bd1] text-white"
                  }
                >
                  {device.status === "Connected" ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">📊 Health Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-700">8,432</div>
                <div className="text-green-600">Steps Today</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">72 bpm</div>
                <div className="text-green-600">Heart Rate</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">120/80</div>
                <div className="text-green-600">Blood Pressure</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-700">7.2h</div>
                <div className="text-green-600">Sleep</div>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthNewsScreen = () => (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-[#5dade2] flex items-center justify-center gap-2">
            <Newspaper className="w-8 h-8" />
            Health News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Button size="sm" className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">
              All
            </Button>
            <Button size="sm" variant="outline">
              Breaking
            </Button>
            <Button size="sm" variant="outline">
              Research
            </Button>
            <Button size="sm" variant="outline">
              Wellness
            </Button>
            <Button size="sm" variant="outline">
              Technology
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "New Study Shows Benefits of Mediterranean Diet for Heart Health",
                summary:
                  "Researchers found that following a Mediterranean diet can reduce cardiovascular disease risk by up to 30%.",
                time: "2 hours ago",
                category: "Research",
                image: "🫒",
              },
              {
                title: "FDA Approves New Treatment for Type 2 Diabetes",
                summary:
                  "The new medication shows promising results in clinical trials with fewer side effects than existing treatments.",
                time: "4 hours ago",
                category: "Breaking",
                image: "💊",
              },
              {
                title: "Mental Health Apps Show Effectiveness in Reducing Anxiety",
                summary:
                  "A comprehensive study reveals that digital mental health interventions can be as effective as traditional therapy.",
                time: "6 hours ago",
                category: "Technology",
                image: "📱",
              },
              {
                title: "Exercise Guidelines Updated: Quality Over Quantity",
                summary:
                  "New recommendations emphasize the importance of exercise intensity and consistency over duration.",
                time: "8 hours ago",
                category: "Wellness",
                image: "🏃",
              },
            ].map((article, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  <div className="text-4xl">{article.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          article.category === "Breaking"
                            ? "bg-red-100 text-red-800"
                            : article.category === "Research"
                              ? "bg-blue-100 text-blue-800"
                              : article.category === "Technology"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.time}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 hover:text-[#5dade2]">{article.title}</h3>
                    <p className="text-gray-600 text-sm">{article.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-[#5dade2] hover:bg-[#4a9bd1] text-white">Load More Articles</Button>
          </div>

          <Button variant="outline" onClick={() => setCurrentScreen("chat")} className="w-full">
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderChatScreen = () => (
    <>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
          <div className="max-w-2xl w-full text-center space-y-8">
            <h1 className="text-gray-900 font-light text-4xl">How can I help you today?</h1>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="gap-2 h-10 bg-transparent text-xs rounded-lg px-2 py-1">
                <Stethoscope className="w-4 h-4" />
                Plan symptoms
              </Button>
              <Button variant="outline" className="gap-2 h-10 bg-transparent text-xs rounded-lg px-2 py-1">
                <Heart className="w-4 h-4" />
                Check workouts
              </Button>
              <Button variant="outline" className="gap-2 h-10 bg-transparent text-xs rounded-lg px-2 py-1">
                <Newspaper className="w-4 h-4" /> {/* Changed icon to Newspaper */}
                Health news
              </Button>
            </div>
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
              >
                {message.sender === "assistant" && (
                  <Avatar className="w-8 h-8 border border-[#5dade2]">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-[#5dade2] text-white">
                      {currentAssistant?.name ? currentAssistant.name[0] : "HB"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[75%] ${
                    message.sender === "user"
                      ? "bg-[#5dade2] text-white"
                      : "bg-gray-100 text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={chatEndRef} /> {/* Scroll target */}
          </div>
        </ScrollArea>
      )}

      {/* Input Area - Only show on chat screen */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-none">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl bg-white focus-within:border-[#5dade2] transition-colors">
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-gray-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="w-5 h-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0])
                    // You can add logic here to display the file name or preview
                    console.log("Selected file:", e.target.files[0].name)
                  }
                }}
              />
              <Input
                placeholder="Ask anything about your health..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base focus-visible:outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              {selectedFile && <span className="text-xs text-gray-500 ml-2">{selectedFile.name} selected</span>}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8"
                  onClick={() => setCurrentScreen("speech-to-speech")}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">
            Health Buddy can make mistakes. Consider checking important health information with professionals.
          </p>
        </div>
      </div>
    </>
  )

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Sidebar - Fixed */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 h-screen z-30 flex flex-col gap-2 text-foreground bg-gray-50 border-r transition-all duration-300 ease-in-out md:translate-x-0 ${
          sidebarMinimized ? "w-[60px]" : "w-[280px]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 py-1.5">
          {!sidebarMinimized && <span className="font-semibold md:hidden">Menu</span>}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="hidden md:flex w-8 h-8"
            >
              {sidebarMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronDoubleLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="w-8 h-8 md:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 px-4 mx-0 my-0 py-px">
          <Button
            variant="ghost"
            className={`justify-start w-full gap-3 px-3 text-left h-12 ${sidebarMinimized ? "px-2" : ""}`}
          >
            <MessageSquarePlus className="w-5 h-5" />
            {!sidebarMinimized && <span className="text-sm font-medium">New Chat</span>}
          </Button>
        </div>

        <div className="px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`justify-between w-full gap-2 px-3 text-left h-10 ${sidebarMinimized ? "px-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" />
                  {!sidebarMinimized && (
                    <span className="text-sm truncate">{currentAssistant?.name || "Health Assistant"}</span>
                  )}
                </div>
                {!sidebarMinimized && <ChevronDown className="w-4 h-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[260px] ml-2">
              {/* Option to switch back to default Health Buddy */}
              {currentAssistant?.id !== defaultHealthBuddy.id && (
                <DropdownMenuItem onClick={() => handleSelectAssistant(defaultHealthBuddy)}>
                  Health Buddy (Default)
                </DropdownMenuItem>
              )}
              {createdAssistants.length > 1 && currentAssistant?.id !== defaultHealthBuddy.id && (
                <DropdownMenuSeparator />
              )}

              {/* List of created assistants, excluding the default if it's already listed above */}
              {createdAssistants
                .filter((assistant) => assistant.id !== defaultHealthBuddy.id)
                .map((assistant) => (
                  <DropdownMenuItem key={assistant.id} onClick={() => handleSelectAssistant(assistant)}>
                    {assistant.name}
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentScreen("create-assistant")}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Assistant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`justify-between w-full gap-2 px-3 text-left h-10 ${sidebarMinimized ? "px-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4" />
                  {!sidebarMinimized && <span className="text-sm">Features</span>}
                </div>
                {!sidebarMinimized && <ChevronDown className="w-4 h-4" />} {/* Changed to ChevronDown */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[260px] ml-2">
              <DropdownMenuItem onClick={() => setCurrentScreen("emergency-call")}>
                <Phone className="w-4 h-4 mr-2" />
                Emergency call
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("find-hospital")}>
                <Hospital className="w-4 h-4 mr-2" />
                Find hospital near me
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("call-doctor")}>
                <Phone className="w-4 h-4 mr-2" />
                Call a doctor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("identify-drugs")}>
                <Pill className="w-4 h-4 mr-2" />
                Identify drugs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("health-guide")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Health guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("connect-devices")}>
                <Link2 className="w-4 h-4 mr-2" />
                Connect devices
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentScreen("health-news")}>
                <Newspaper className="w-4 h-4 mr-2" />
                Health news
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {!sidebarMinimized && (
          <div className="flex flex-col flex-1 px-4">
            {" "}
            {/* Changed to flex-col and flex-1 */}
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent</div>{" "}
            {/* Fixed label */}
            <ScrollArea className="flex-1 pr-2">
              {" "}
              {/* Scrollable area for links */}
              <div className="grid gap-1 text-foreground">
                <Link href="#" className="flex-1 block p-3 text-sm transition-colors rounded-lg hover:bg-white/50">
                  Getting Started
                </Link>
                <Link href="#" className="flex-1 block p-3 text-sm transition-colors rounded-lg hover:bg-white/50">
                  Nutrition Tracking
                </Link>
                <Link href="#" className="flex-1 block p-3 text-sm transition-colors rounded-lg hover:bg-white/50">
                  Exercise Planning
                </Link>
                <Link href="#" className="flex-1 block p-3 text-sm transition-colors rounded-lg hover:bg-white/50">
                  Medication Reminders
                </Link>
                <Link href="#" className="flex-1 block p-3 text-sm transition-colors rounded-lg hover:bg-white/50">
                  Sleep Analysis
                </Link>
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={`justify-start w-full gap-3 px-3 text-left h-10 ${sidebarMinimized ? "px-2" : ""}`}
          >
            <Settings className="w-4 h-4" />
            {!sidebarMinimized && <span className="text-sm">Settings</span>}
          </Button>
        </div>
      </div>

      {/* Main Content - Independent scrolling */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarMinimized ? "md:ml-[60px]" : "md:ml-[280px]"}`}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 bg-white border-b border-none">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className={`w-8 h-8 md:hidden ${sidebarOpen ? "hidden" : "block"}`}
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <div className="flex items-center justify-center w-8 h-8 bg-[#5dade2] rounded-full">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">HEALTH BUDDY</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Current Screen */}
        {currentScreen === "chat" && renderChatScreen()}
        {currentScreen === "create-assistant" && renderCreateAssistantScreen()}
        {currentScreen === "speech-to-speech" && renderSpeechToSpeechScreen()}
        {currentScreen === "emergency-call" && renderEmergencyCallScreen()}
        {currentScreen === "find-hospital" && renderFindHospitalScreen()}
        {currentScreen === "call-doctor" && renderCallDoctorScreen()}
        {currentScreen === "identify-drugs" && renderIdentifyDrugsScreen()}
        {currentScreen === "health-guide" && renderHealthGuideScreen()}
        {currentScreen === "connect-devices" && renderConnectDevicesScreen()}
        {currentScreen === "health-news" && renderHealthNewsScreen()}
      </div>
    </div>
  )
}
