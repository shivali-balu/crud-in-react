import { EditableText, Toaster } from "@blueprintjs/core";
import "./App.css";
import { useEffect, useState } from "react";

const apptoaster = Toaster.create({
  position: "top",
});

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  //Update data function by changing the state
  function onChangeHandler(id, key, value) {
     setUsers((users) => {
       return users.map((user) => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  //click event function to update the data
  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(
      `https://jsonplaceholder.typicode.com/users/10`,

      {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-type": "application/json ; charset = UTF-8",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        apptoaster.show({
          message: "User updated successfully !",
          intent: "success",
          timeout: 3000,
        });
      });
  } 

  //Delete user function 
  function deleteUser(id){
    fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,

      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => { 
        setUsers((users)=>{
          return users.filter((user)=>user.id !== id) ;
        })
        apptoaster.show({
          message: "User deleted successfully !",
          intent: "danger",
          timeout: 3000,
        });
      });
  }
  //Add user function
  function addUser() {
    //trimming the user input
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    //Data validation
    if (name && email && website) {
      fetch(
        "https://jsonplaceholder.typicode.com/users",

        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            website,
          }),
          headers: {
            "Content-type": "application/json ; charset = UTF-8",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]); //updating again with added record in the list
          apptoaster.show({
            message: "User added successfully !",
            intent: "success",
            timeout: 3000,
          });

          //setting empty value after rendering the newly added data in the list to make the input box empty
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });
    }
  }

  //return function
  return (
    <div className="App">
      <table className="table table-hover">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) => onChangeHandler(user.id, "email", value)}
                  value={user.email}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onChangeHandler(user.id, "website", value)
                  }
                  value={user.website}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => updateUser(user.id)}
                >
                  Update
                </button>
                <button className="btn btn-danger" onClick={()=>deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <td></td>
          <td>
            <input
              value={newName}
              className="form-control"
              placeholder="Enter name..."
              onChange={(e) => setNewName(e.target.value)}
            />
          </td>

          <td>
            <input
              className="form-control"
              value={newEmail}
              placeholder="Enter email..."
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </td>

          <td>
            <input
              className="form-control"
              value={newWebsite}
              placeholder="Enter website..."
              onChange={(e) => setNewWebsite(e.target.value)}
            />
          </td>
          <td>
            <button className="btn btn-success" onClick={addUser}>
              Add User
            </button>
          </td>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
