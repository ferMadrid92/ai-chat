import Form from "./components/Form"
import Notification from "./components/Notification"
import SynapseAnimation from "./components/SynapseAnimation"

function App() {

  return (
    <>
      <SynapseAnimation />
      <h1 className="font-bold text-2xl lg:text-3xl text-center mt-5">Chat with AI Models for free</h1>
      <Form />
      <Notification />
    </>
  )
}

export default App
