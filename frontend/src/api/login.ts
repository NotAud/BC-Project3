export default async function loginUser(username: string, password: string) {
  const query = `
        mutation login($username: String!, $password: String!) {
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

    const r = await response.json();

    if (!response.ok) throw new Error("Bad Response");
    if (r.errors) throw new Error(r.errors[0].message);
    if (r.data === null) throw new Error("No Response");

    // Login successful
    const userData = r.data.login.user;
    const token = r.data.login.token;

    const user = {
      id: userData.id,
      username: userData.username,
      token: token,
    };
    // Store the token for future authenticated requests
    localStorage.setItem("user", JSON.stringify(user));

    return {
      data: r.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}
