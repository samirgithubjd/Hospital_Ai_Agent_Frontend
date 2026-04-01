# 🎯 AI Agent Web Call Integration - Senior Developer Setup Guide

## ✅ Frontend Changes Completed

### 1. **Vapi SDK Integration** 
- ✅ Loads Vapi JavaScript SDK dynamically
- ✅ Initializes Vapi client on modal open
- ✅ Handles media stream permissions  

### 2. **Web Call Features**
- ✅ Microphone permission handling with error messages
- ✅ Real media stream capture and management
- ✅ Actual mute/unmute of audio tracks
- ✅ Proper call cleanup on end
- ✅ Agent number display: **+19144651284**

### 3. **Call States**
- ✅ Initializing → Setup phase
- ✅ Connecting → Attempting connection to agent
- ✅ Active → Live call with timer, mute, end buttons
- ✅ Ended → Call completed
- ✅ Error → Microphone/connection issues

---

## ⚠️ CRITICAL: What Backend MUST Do

Your current backend code only **creates a database record**. It does NOT connect to Vapi API. Here's what needs to be fixed:

### **Backend Required Changes**

```javascript
// BACKEND FIX: initiateWebCall must call Vapi API

const initiateWebCall = async (req, res) => {
  try {
    const { patientId } = req.body;

    // ... existing validation ...

    // ⭐ CRITICAL: Initialize Vapi Call
    const vapiResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customerNumber: patient.phone, // Patient's phone number
        assistantId: process.env.VAPI_ASSISTANT_ID, // AI Agent ID
        // OR use assistantOverrides for custom agent:
        assistantOverrides: {
          model: {
            provider: 'openai',
            model: 'gpt-4',
            systemPrompt: 'You are a hospital assistant. Collect symptoms and book appointment.'
          },
          voice: {
            provider: 'eleven-labs',
            voiceId: 'default'
          }
        }
      })
    });

    const vapiCall = await vapiResponse.json();

    // Create web call record with Vapi details
    const webCall = new Call({
      patientId: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      callType: 'web',
      status: 'initiated',
      symptoms: symptoms || null,
      vapiCallData: {
        sessionToken: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        vapiCallId: vapiCall.id, // ⭐ VAPI CALL ID
        vapiPhoneNumber: '+19144651284', // OR from Vapi response
        doctorId: doctor ? doctor._id : null,
        callReason: callReason || 'Consultation',
        initiatedAt: new Date().toISOString()
      },
      startTime: new Date()
    });

    await webCall.save();

    res.status(201).json({
      success: true,
      message: 'Web call session initiated successfully',
      data: {
        callId: webCall._id,
        sessionToken: webCall.vapiCallData.sessionToken,
        vapiCallId: vapiCall.id, // ⭐ SEND TO FRONTEND
        vapiToken: vapiCall.accessToken, // ⭐ IF AVAILABLE
        agentNumber: '+19144651284',
        patientId: patient._id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        status: 'initiated',
        connectionDetails: {
          sessionToken: webCall.vapiCallData.sessionToken,
          callId: webCall._id.toString(),
          patientId: patient._id.toString(),
          timestamp: Date.now()
        }
      }
    });
  } catch (error) {
    console.error('Vapi Initiate Call Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Vapi call',
      error: error.message
    });
  }
};
```

### **Environment Variables Needed**
```bash
VAPI_API_KEY=your_vapi_api_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
VAPI_ASSISTANT_ID=your_ai_agent_assistant_id
```

---

## 🔧 To Make This Work:

### Step 1: Get Vapi Credentials
1. Sign up at https://console.vapi.ai/
2. Go to Dashboard → API Keys → Create API Key
3. Go to Phone Numbers → Get your number (e.g., +19144651284)
4. Create an AI Assistant or use existing one
5. Get Assistant ID

### Step 2: Update Backend
Replace `initiateWebCall` in your backend with the code above

### Step 3: Add Environment Variables
```
VAPI_API_KEY=sk-xxxxx
VAPI_PHONE_NUMBER_ID=xxxxx
VAPI_ASSISTANT_ID=xxxxx
```

### Step 4: Test
1. Patient clicks "Call Now via Web"
2. Frontend loads Vapi SDK ✅
3. Backend calls Vapi API to create actual call
4. Vapi dials patient's phone number
5. Patient answers and speaks with AI agent
6. Agent collects info and backend books appointment

---

## 📱 Frontend Ready Features

The frontend component now:
- ✅ Loads Vapi Web SDK
- ✅ Requests microphone permission
- ✅ Captures media stream
- ✅ Shows agent number: +19144651284
- ✅ Displays call timer
- ✅ Handles mute/unmute properly
- ✅ Polls for appointment status
- ✅ Shows success when appointment booked
- ✅ Proper error messages

---

## 🐛 Troubleshooting

If "no one is talking from other side":
1. ❌ Backend NOT calling Vapi API → FIX BACKEND
2. ❌ Vapi credentials invalid → CHECK ENV VARS
3. ❌ Patient phone not set → VERIFY patient.phone
4. ❌ Microphone permissions denied → CHECK browser console
5. ❌ Vapi assistant not configured → CHECK Vapi dashboard

---

## 🎓 Next Steps

1. Get Vapi API credentials
2. Update backend initiateWebCall function
3. Add environment variables
4. Test end-to-end
5. AI agent will call patient and collect info
6. Appointment auto-booked

Your **FRONTEND IS READY** ✅ - Backend needs Vapi API integration!
