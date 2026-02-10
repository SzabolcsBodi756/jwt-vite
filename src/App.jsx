import { useState } from "react";
import axios from "axios";

export const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [data, setData] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Boolean(token);

  const handleLogin = async () => {
    setErrorMessage(""); // előző hiba törlése

    try {
      const response = await axios.post("https://jwt.sulla.hu/login", {
        username,
        password,
      });

      const t = response?.data?.token;

      if (!t) {
        setErrorMessage("Nem sikerült a bejelentkezés!");
        console.log("Nem sikerült a bejelentkezés!");
        return;
      }

      setToken(t);
      setData(null);
      console.log("TOKEN:", t);
    } catch (error) {
      setErrorMessage("Hibás adat, user vagy password nem megfelelő");
      console.log("Hibás adat, user vagy password nem megfelelő");
      console.error(error);
    }
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const response = await axios.get("https://jwt.sulla.hu/termekek", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data);
      console.log("Védett adatok:", response.data);
    } catch (error) {
      console.error("Adatlekérés sikertelen!", error);
    }
  };

  const logout = () => {
    setToken("");
    setData(null);
    setErrorMessage("");
  };

  return (
    <div className="min-vh-100 w-100 bg-dark d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-6 col-lg-5 col-xl-4">
            <div
              className={`card shadow border-3 ${
                loggedIn ? "border-success" : "border-danger"
              }`}
            >
              <div className="card-body text-center">
                <h3 className="mb-4">
                  {loggedIn ? "Bejelentkezve" : "Bejelentkezés"}
                </h3>

                {/* HIBAÜZENET */}
                {errorMessage && (
                  <div className="alert alert-danger text-center">
                    {errorMessage}
                  </div>
                )}

                {!loggedIn ? (
                  <>
                    <div className="mb-3 text-start">
                      <label className="form-label">Felhasználónév</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="felhasználónév"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label className="form-label">Jelszó</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="jelszó"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button className="btn btn-danger w-100" onClick={handleLogin}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Bejelentkezés
                    </button>

                    <div className="text-secondary mt-3 small">
                      Teszt adatok: <br />
                      user / password
                    </div>
                  </>
                ) : (
                  <>
                    <div className="alert alert-success">
                      ✔ Sikeres bejelentkezés
                    </div>

                    <button
                      className="btn btn-success w-100 mb-3"
                      onClick={fetchData}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Védett adatok lekérdezése
                    </button>

                    {/* csak akkor jelenik meg, ha VAN token és VAN data */}
                    {token && data && (
                      <div className="table-responsive">
                        <table className="table table-sm table-striped mb-0">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Név</th>
                              <th>Ár</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(data) ? (
                              data.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.id}</td>
                                  <td>{item.name}</td>
                                  <td>{item.price}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-secondary">
                                  A válasz nem tömb.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <button
                      className="btn btn-outline-secondary w-100 mt-3"
                      onClick={logout}
                    >
                      Kijelentkezés
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* apró státusz a kártya alatt */}
            <div className="text-center text-secondary small mt-3">
              Státusz:{" "}
              <span className={loggedIn ? "text-success" : "text-danger"}>
                {loggedIn ? "Bejelentkezve" : "Bejelentkezés szükséges"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
