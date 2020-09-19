import React, { FC, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

import { Transfer } from "antd";
import "./Picker.css";
import { TransferItem } from "antd/lib/transfer";
export interface PickerProps {
  target: Array<string>;
  set: React.Dispatch<React.SetStateAction<string[]>>;
}

const GET_INGERDIENTS = gql`
  query {
    ingredients
  }
`;

const Picker: FC<PickerProps> = ({ target, set }) => {
  const { loading, error, data } = useQuery(GET_INGERDIENTS);
  const [tData, setData] = useState<Array<TransferItem>>();
  useEffect(() => {
    if (!loading)
      setData(
        data.ingredients.map((i: String) => ({
          key: i,
          title: i,
        }))
      );
  }, [data, loading]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error....</p>;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Transfer
        listStyle={{ height: "70vh" }}
        dataSource={tData}
        showSearch
        targetKeys={target}
        titles={["Source", "Target"]}
        style={{ marginBottom: 16 }}
        render={(item) => item.title!}
        onChange={(nextTargetKeys, direction, moveKeys) =>
          direction === "right"
            ? set([...target, ...nextTargetKeys])
            : set(target.filter((item) => !moveKeys.includes(item)))
        }
      />
    </div>
  );
};

export default Picker;
