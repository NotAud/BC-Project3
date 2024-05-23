export default async function loginUser(username: string, password: string) {
  const query = `
        mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                token
                user {
                    id
                    username
                }
            }
        }
    `;

  const variables = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful
      const token = data.data.login.token;
      const user = data.data.login.user;
      console.log("Logged in successfully!");
      console.log("Token:", token);
      console.log("User:", user);
      // Store the token for future authenticated requests
      localStorage.setItem("token", token);
    } else {
      // Login failed
      console.error("Login failed:", data.errors);
    }
  } catch (error) {
    return null;
  }
}
