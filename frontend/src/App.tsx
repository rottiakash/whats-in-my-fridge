import { Button } from "antd";
import React, { useState } from "react";
import "./App.css";
import Picker from "./Picker";
import Result from "./Result";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
const GET_SCORE = gql`
  query score($input: [String]!) {
    score(input: $input) {
      name
      url
      score
      missing
    }
  }
`;
function App() {
  const [target, set] = useState<Array<string>>([]);
  const [getScore, { called, loading, data }] = useLazyQuery(GET_SCORE);
  return (
    <div>
      {!called && <Picker target={target} set={set} />}
      {!called && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
        >
          <Button
            type="primary"
            onClick={() => getScore({ variables: { input: target } })}
          >
            Submit
          </Button>
        </div>
      )}
      {called && loading && <div>Loading....</div>}
      {called && !loading && <Result score={data.score!} />}
    </div>
  );
}

export default App;
