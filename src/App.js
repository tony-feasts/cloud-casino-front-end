import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { gql, useQuery } from "@apollo/client";


const GET_PLAYER_STATS = gql`
  query {
    playerCount
    usernameWithHighestGameId
  }
`;

function App() {
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState('');
  const { loading, error, data } = useQuery(GET_PLAYER_STATS);
  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Full credential response:", credentialResponse);
      const { access_token } = credentialResponse;
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const userInfo = await response.json();
      console.log("User info from userinfo endpoint:", userInfo);
      console.log("User SUB claim:", userInfo.sub);
    },
    onError: () => {
      console.error('Google Login Failed');
    },
  });

  const handleSignUpClick = () => setShowUsernamePrompt(true);

  const handleUsernameSubmit = () => {
    googleLogin();
  };

  return (
      <div style={{padding: '20px', 'textAlign': 'center', }}>
        <h1>Online Casino</h1>
        <div style={{padding: '20px', marginBottom: '26px'}}>
          {!error && !loading ? <span>Welcome! We have {{data}&&data.playerCount} new players. {{data}&&data.usernameWithHighestGameId} won the last game.</span>:''}
        </div>

        <button onClick={handleSignUpClick}>Sign Up</button>
        <button style={{marginLeft: '10px'}}>Log In (not implemented)</button>

        {showUsernamePrompt && (
            <div style={{marginTop: '20px'}}>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  style={{marginRight: '10px'}}
              />
              <button onClick={handleUsernameSubmit}>Sign in with Google</button>
            </div>
        )}
      </div>
  );
}

export default App;
