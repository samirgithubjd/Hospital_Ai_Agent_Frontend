"use client";

import React, { useState } from "react";
import { Save, Plus, Trash2, MessageCircle, Globe } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabList, TabTrigger, TabContent } from "@/components/ui/tabs";

export default function AISettingsPage() {
    const [greeting, setGreeting] = useState(
        "Hello, welcome to our hospital. How can I assist you today?",
    );
    const [enableEmergency, setEnableEmergency] = useState(true);
    const [enableAutoBooking, setEnableAutoBooking] = useState(true);
    const [language, setLanguage] = useState("en");
    const [questions, setQuestions] = useState([
        "What symptoms are you experiencing?",
        "How long have you had these symptoms?",
        "Are you currently on any medications?",
    ]);
    const [newQuestion, setNewQuestion] = useState("");

    const handleAddQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion]);
            setNewQuestion("");
        }
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-50 mb-2">
                    AI Agent Settings
                </h1>
                <p className="text-slate-400">
                    Configure your AI voice agent behavior and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabList>
                    <TabTrigger value="general">General</TabTrigger>
                    <TabTrigger value="questions">Questions</TabTrigger>
                    <TabTrigger value="language">Language</TabTrigger>
                </TabList>

                {/* General Settings */}
                <TabContent value="general">
                    <div className="space-y-6">
                        {/* Greeting Message */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Greeting Message
                                </CardTitle>
                                <CardDescription>
                                    The message the AI will use to greet callers
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Label>Greeting Text</Label>
                                <textarea
                                    value={greeting}
                                    onChange={(e) =>
                                        setGreeting(e.target.value)
                                    }
                                    className="w-full mt-2 p-3 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-50 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    rows={3}
                                />
                            </CardContent>
                        </Card>

                        {/* Feature Toggles */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Toggles</CardTitle>
                                <CardDescription>
                                    Enable or disable specific AI features
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                    <div>
                                        <p className="font-medium text-slate-50">
                                            Emergency Detection
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Automatically detect and flag
                                            emergency calls
                                        </p>
                                    </div>
                                    <Switch
                                        checked={enableEmergency}
                                        onCheckedChange={setEnableEmergency}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                    <div>
                                        <p className="font-medium text-slate-50">
                                            Auto Booking
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Automatically book appointments
                                            based on AI recommendations
                                        </p>
                                    </div>
                                    <Switch
                                        checked={enableAutoBooking}
                                        onCheckedChange={setEnableAutoBooking}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="primary"
                                    className="w-full md:w-auto"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabContent>

                {/* Questions Settings */}
                <TabContent value="questions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Diagnostic Questions</CardTitle>
                            <CardDescription>
                                Questions the AI will ask patients to understand
                                their symptoms
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Question List */}
                            <div className="space-y-2">
                                {questions.map((question, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700"
                                    >
                                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                                            {index + 1}
                                        </span>
                                        <span className="flex-1 text-slate-200">
                                            {question}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleRemoveQuestion(index)
                                            }
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Question */}
                            <div className="pt-4 border-t border-slate-700">
                                <Label>Add New Question</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        placeholder="Enter a new diagnostic question..."
                                        value={newQuestion}
                                        onChange={(e) =>
                                            setNewQuestion(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter")
                                                handleAddQuestion();
                                        }}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleAddQuestion}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabContent>

                {/* Language Settings */}
                <TabContent value="language">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Language & Localization
                            </CardTitle>
                            <CardDescription>
                                Configure language preferences for the AI agent
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Primary Language</Label>
                                <select
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                    className="w-full mt-2 rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="pt">Portuguese</option>
                                    <option value="zh">Mandarin</option>
                                </select>
                            </div>

                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
                                <p>
                                    The AI agent will respond to patients in the
                                    selected language and provide localized
                                    information such as hospital hours and local
                                    contact information.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="primary"
                                className="w-full md:w-auto"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Language Settings
                            </Button>
                        </CardFooter>
                    </Card>
                </TabContent>
            </Tabs>
        </div>
    );
}
