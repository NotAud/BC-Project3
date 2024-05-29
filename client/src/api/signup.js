export default async function signupUser(username, password) {
  const query = `
          mutation createUser($username: String!, $password: String!) {
            createUser(username: $username, password: $password) {
                id
                username
              }
          }
      `;

  const variables = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("https://bc-project3.onrender.com/graphql", {
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
    if (r.errors) throw new Error("User already exists");
    if (r.data === null) throw new Error("No Response");

    return {
      data: "User created successfully",
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}
