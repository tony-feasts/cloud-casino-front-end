import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { Buffer } from 'buffer'; // Import Buffer

window.Buffer = Buffer;

function App() {
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  // Configure AWS Lambda Client
  const lambdaClient = new LambdaClient({
    region: 'us-east-2', // Replace with your Lambda's region
    credentials: {
      accessKeyId: 'AKIA3RYC544ZXENTL6UR', // Replace with your AWS Access Key
      secretAccessKey: 'l/qAWZ5yj7FPCqS4eM3mLWjJPeMAUkrL9G7EsZn9', // Replace with your AWS Secret Key
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log('Full credential response:', credentialResponse);
      const { access_token } = credentialResponse;

      // Fetch user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const userInfo = await response.json();
      console.log('User info from userinfo endpoint:', userInfo);

      // Extract email and store it
      setEmail(userInfo.email);

      // Trigger Lambda function to send email notification
      try {
        console.log(userInfo.email);
        const payload = {
          email: userInfo.email,
          username,
        };

        const command = new InvokeCommand({
          FunctionName: 'SendSignupEmail', // Replace with your Lambda function name
          Payload: Buffer.from(JSON.stringify(payload)), // Use imported Buffer
        });

        const result = await lambdaClient.send(command);

        // Parse Lambda response
        const responsePayload = JSON.parse(
          new TextDecoder().decode(result.Payload)
        );

        setNotification(responsePayload.message);
      } catch (error) {
        console.error('Error invoking Lambda function:', error);
        setNotification('Failed to send email notification.');
      }
    },
    onError: () => {
      console.error('Google Login Failed');
      setNotification('Google Login Failed');
    },
  });

  const handleSignUpClick = () => setShowUsernamePrompt(true);

  const handleUsernameSubmit = () => {
    googleLogin();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Online Casino</h1>
      <button onClick={handleSignUpClick}>Sign Up</button>
      <button style={{ marginLeft: '10px' }}>Log In (not implemented)</button>

      {showUsernamePrompt && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleUsernameSubmit}>Sign in with Google</button>
        </div>
      )}

      {notification && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;
