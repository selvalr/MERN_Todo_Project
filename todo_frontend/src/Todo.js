import React, { useEffect, useState } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todo, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  //Edit
  const [edittitle, editTitle] = useState("");
  const [editdescription, editsetDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todo, { title, description }]);

            setTitle("");
            setDescription("");
            setMessage("Item Added Successfully");

            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to Create Todo Item");
          }
        })
        .catch(() => {
          setError("Unable to Create Todo Item");
        });
    } else {
      setError("Please provide both title and description.");
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  // Get All Data
  const getDatas = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json()) // Corrected this line
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setError("Unable to fetch data.");
      });
  };

  const updateValue = () => {
    setError("");
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: edittitle,
          description: editdescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            //update items
            const updatedTodos = todo.map((item) => {
              if (item._id === editId) {
                item.title = edittitle;
                item.description = editdescription;
              }
              return item;
            });
            setTodos(updatedTodos);
            editTitle("");
            editsetDescription("");
            setMessage("Item Update Successfully");

            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to Create Todo Item");
          }
        })
        .catch(() => {
          setError("Unable to Create Todo Item");
        });
    } else {
      setError("Please provide both title and description.");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    editTitle(item.title);
    editsetDescription(item.description);
  };

  const cancelButton = () => {
    setEditId(-1);
  };

  const deleteBtn = (id) => {
    console.log(id);
    if (window.confirm("You want to delette ?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodo = todo.filter((item) => item._id !== id);

        setTodos(updatedTodo);
      });
    }
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Projects with MERN stack</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            className="form-control"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            className="form-control"
            placeholder="Description"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div className="row mt-3">
        <h3>TODO</h3>
        <div className=" col-md-6">
          <ul className="list-group">
            {todo.map((item, index) => (
              <li
                key={index} // Added a unique key for each list item
                className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
              >
                <div className="d-flex flex-column me-2">
                  {editId === -1 || item._id !== editId ? (
                    <>
                      <span className="fw-bold">{item.title}</span>{" "}
                      <span>{item.description}</span>{" "}
                      {/* Corrected rendering */}
                    </>
                  ) : (
                    <>
                      <div className="form-group d-flex gap-2">
                        <input
                          type="text"
                          placeholder="Title"
                          value={edittitle}
                          className="form-control"
                          onChange={(e) => {
                            editTitle(e.target.value);
                          }}
                        />
                        <input
                          className="form-control"
                          placeholder="Description"
                          type="text"
                          value={editdescription}
                          onChange={(e) => {
                            editsetDescription(e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === -1 || item._id !== editId ? (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        handleEdit(item);
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        updateValue();
                      }}
                    >
                      Update
                    </button>
                  )}
                  {editId === -1 ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        deleteBtn(item._id);
                      }}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="btn btn-danger" onClick={cancelButton}>
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Todo;
