import "./App.css";
import { Form } from "./Form/Form";

function App() {
  return (
    <div className="App">
      <Form method="post" action="http://localhost:4000/api/users">
        {({ data, error, status, transition }) => (
          <>
            <pre>
              Result
              <br />
              {JSON.stringify(
                { state: transition.state, status, data, error },
                null,
                2
              )}
            </pre>
            <div>
              <label htmlFor="email">Your Email</label>
              <input id="email" name="email" type="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" />
            </div>
            <button
              type="submit"
              name="_action"
              value="create"
              disabled={transition.state === "submitting"}
            >
              Create
            </button>
            <button
              type="submit"
              name="_action"
              value="delete"
              disabled={transition.state === "submitting"}
            >
              Delete
            </button>
          </>
        )}
      </Form>
    </div>
  );
}

export default App;
