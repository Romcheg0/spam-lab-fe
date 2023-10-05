import React, { useEffect, useState } from "react"
export default function App() {
  const [rows, setRows] = useState([])
  const [update, setUpdate] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [id, setId] = useState(-1)
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [patronymic, setPatronymic] = useState(null)
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [text, setText] = useState("")
  const [queryState, setQueryState] = useState(null)
  const [emailContent, setEmailContent] = useState("")
  const [showTextArea, setShowTextArea] = useState(false)
  const emailContentList = [
    "Exclusive Offer! Get a 50% discount on our latest collection of fashionable accessories! Hurry and place your order now!",
    "Invest in your future with our exclusive financial platform! Start earning today. Registration is free!",
    "Explore the world of online courses! Improve your skills and career. Special offer - first lesson is free!",
    "Hungry? Order delicious pizza with free delivery on orders over $50! Enjoy the taste right now!",
    "Want to get fit? Get 30 days of free access to our fitness club and start working out today. Achieve your goals!",
  ]
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res, rej) => {
        return res.json()
      })
      .then((data) => {
        setRows(data)
      })
  }, [update])

  return (
    <section className="container col pt-4 d-flex flex-column gap-2">
      <button
        className="btn btn-success btn-md w-50 mx-auto"
        onClick={() => setUpdate(!update)}
      >
        Update
      </button>
      <button
        className="btn btn-primary btn-md w-50 mx-auto"
        data-bs-toggle="modal"
        data-bs-target="#modal"
        onClick={() => {
          setModalMode("add")
        }}
      >
        Add user
      </button>
      <section className="container col pt-4 d-flex flex-row justify-content-between">
        <div className="container row pt-4 gap-2 align-items-center">
          {rows.length ? (
            <table className="table table-dark table-striped table-hover border-top">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Last name</th>
                  <th scope="col">First name</th>
                  <th scope="col">Patronymic</th>
                  <th scope="col">Email</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  return (
                    <tr key={row.ID}>
                      <td>{row.ID}</td>
                      <td>{row.last_name}</td>
                      <td>{row.first_name}</td>
                      <td>{row.patronymic || "-"}</td>
                      <td>{row.email}</td>
                      <td>
                        <button
                          className="btn"
                          data-bs-toggle="modal"
                          data-bs-target="#modal"
                          onClick={() => {
                            setModalMode("edit")
                            setId(row.ID)
                            setLastName(row.last_name)
                            setFirstName(row.first_name)
                            setPatronymic(row.patronymic || null)
                            setEmail(row.email)
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            fetch(`http://localhost:3000/users/${row.ID}`, {
                              method: "DELETE",
                              headers: {
                                "Content-Type": "application/json",
                              },
                            })
                              .then(() => {
                                setTimeout(() => {
                                  setUpdate(!update)
                                }, 1000)
                              })
                              .catch((e) => {
                                alert("Error" + e.message)
                              })
                          }}
                        >
                          ❌
                        </button>
                        <button
                          className="btn"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offCanvas"
                          aria-controls="offcanvas"
                          id="btn__canvas_toggle"
                          onClick={() => {
                            setId(row.ID)
                            setLastName(row.last_name)
                            setFirstName(row.first_name)
                            setPatronymic(row.patronymic || null)
                            setEmail(row.email)
                          }}
                        >
                          📩
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <h2>No users yet</h2>
          )}
          <div className="modal fade" tabIndex={-1} id="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalMode === 1 ? "Edit user" : "Add user"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form id="userForm">
                    <label htmlFor="lastNameInput" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastNameInput"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value)
                      }}
                    />
                    <label htmlFor="firstNameInput" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstNameInput"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                      }}
                    />
                    <label htmlFor="patronymicInput" className="form-label">
                      Patronymic
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patronymicInput"
                      value={patronymic || ""}
                      onChange={(e) => {
                        setPatronymic(e.target.value)
                      }}
                    />
                    <label htmlFor="emailInput" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                      required
                    />
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    className={`btn ${
                      !queryState
                        ? "btn-primary"
                        : queryState === "loading"
                        ? "spinner-border"
                        : queryState === "error"
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                    type="submit"
                    form="userForm"
                    onClick={async (e) => {
                      e.preventDefault()
                      if (
                        !/^[\w-\.\d-_]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) ||
                        !firstName.length ||
                        !lastName.length
                      ) {
                        alert("Incorrect data!")
                        return
                      }
                      setQueryState("loading")
                      fetch(`http://localhost:3000/users/${id}`, {
                        method: modalMode === "edit" ? "PUT" : "POST",
                        body: JSON.stringify({
                          last_name: `${lastName}`,
                          first_name: `${firstName}`,
                          patronymic: patronymic ? `${patronymic}` : null,
                          email: `${email}`,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      })
                        .then((res) => {
                          res.json().then((result) => {
                            if (
                              res.status < 200 ||
                              res.status > 299 ||
                              !result.affectedRows
                            ) {
                              console.log(result)
                              alert("Error!")
                            } else {
                              setQueryState("success")
                              setTimeout(() => {
                                setUpdate(!update)
                              }, 2000)
                            }
                          })
                        })
                        .catch((e) => {
                          alert("Error!\n" + e.message)
                          setQueryState("error")
                        })
                        .finally(() => {
                          setTimeout(() => {
                            setQueryState(null)
                          }, 2000)
                        })
                    }}
                  >
                    {!queryState
                      ? "Save"
                      : queryState === "loading"
                      ? ""
                      : queryState === "error"
                      ? "Error"
                      : "Success"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offCanvas"
          aria-labelledby="offCanvasLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offCanvasLabel">
              Mail menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            <table className="table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{id}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{lastName}</td>
                </tr>
                <tr>
                  <td>First Name</td>
                  <td>{firstName}</td>
                </tr>
                {patronymic && (
                  <tr>
                    <td>Patronymic</td>
                    <td>{patronymic}</td>
                  </tr>
                )}
                <tr>
                  <td>Email</td>
                  <td>{email}</td>
                </tr>
                <tr className="align-middle">
                  <td colSpan={2}>
                    <div className="input-group input-group-md ">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-md"
                      >
                        Subject
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-md"
                        value={subject}
                        onInput={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
                <tr className="align-middle">
                  <td colSpan={2}>
                    <div className="input-group input-group-md ">
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-md"
                      >
                        Mail Text
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-md"
                        value={text}
                        onInput={(e) => setText(e.target.value)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <select
              id="emailContentSelect"
              className="form-select mb-3"
              defaultValue={0}
              onChange={(e) => {
                if (e.target.value == 1) {
                  setShowTextArea(true)
                } else if (e.target.value > 1) {
                  setEmailContent(emailContentList[e.target.value - 2])
                  setShowTextArea(false)
                } else {
                  setEmailContent("")
                }
              }}
            >
              <option value={0} disabled>
                Email content
              </option>
              <option value={1}>-Choose custom content-</option>
              {emailContentList.map((message, index) => (
                <option key={index + 2} value={index + 2}>
                  {message.length > 30
                    ? message.substring(0, 30) + "..."
                    : message}
                </option>
              ))}
            </select>
            {showTextArea && (
              <div className="form-floating d-flex flex-column align-items-center">
                <textarea
                  className="form-control mt-3"
                  id="emailTextArea"
                  style={{ height: "100px" }}
                  value={emailContent}
                  onInput={(e) => setEmailContent(e.target.value)}
                ></textarea>
                <label htmlFor="emailTextArea">Email Content</label>
                <br />
              </div>
            )}
            {emailContent.length > 0 &&
              subject.length > 0 &&
              text.length > 0 && (
                <button
                  className={`btn ${
                    !queryState
                      ? "btn-primary"
                      : queryState === "loading"
                      ? "spinner-border"
                      : queryState === "error"
                      ? "btn-danger"
                      : "btn-success"
                  }`}
                  type="button"
                  onClick={() => {
                    fetch(`http://localhost:3000/mailTo`, {
                      method: "POST",
                      body: JSON.stringify({
                        to: `${email}`,
                        subject: `${subject}`,
                        text: `${text}`,
                        html: `<p>${emailContent}</p>`,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                      .then((res) => {
                        res.json().then((result) => {
                          if (res.status < 200 || res.status > 299) {
                            console.log(result)
                            alert("Error!")
                          } else {
                            setQueryState("success")
                          }
                        })
                      })
                      .catch((e) => {
                        alert("Error!\n" + e.message)
                        setQueryState("error")
                      })
                      .finally(() => {
                        setTimeout(() => {
                          setQueryState(null)
                        }, 2000)
                      })
                  }}
                >
                  {!queryState
                    ? "Send"
                    : queryState === "loading"
                    ? ""
                    : queryState === "error"
                    ? "Error"
                    : "Success"}
                </button>
              )}
          </div>
        </div>
      </section>
    </section>
  )
}

