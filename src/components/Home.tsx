import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import axios from "axios";
import { putCar, deleteCar } from "../api/apiEndPoints";
import FormComponent from "./FormComponent";


export interface Item {
  id: string;
  engineCyl: string;
  engineSize: string;
  maker: string;
  model: string;
  mpgCity: string;
  mpgCombined: string;
  mpgHighway: string;
  rating: string;
  year: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const { Title } = Typography; //Typography for Ant Design

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Home: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);

  const onInit = () => {
    const api = `${process.env.REACT_APP_ENDPOINT}inventory`; //link from the .env file
    axios
      .get(api)
      .then((response) => {
        const dataWithKeys = response.data.inventory.map(
          (item: { id: string }) => ({ ...item, key: item.id })
        );
        setData(dataWithKeys);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    onInit()
  }, []);

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record.id === editingKey;


  const edit = (record: Partial<Item> & { id: React.Key }) => {
    form.setFieldsValue({
      engineCyl: "",
      engineSize: "",
      maker: "",
      model: "",
      mpgCity: "",
      mpgCombined: "",
      mpgHighway: "",
      rating: "",
      year: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        console.log(newData[index]);
        putCar(newData[index]);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        putCar(newData[index]);
        console.log(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key: React.Key) => {
    const dataSource = [...data];
    const newData = dataSource.filter((item) => item.id !== key);
    setData(newData);
  };

  const columns = [
    {
      title: "model",
      dataIndex: "model",
      width: "10%",
      editable: true,
    },
    {
      title: "maker",
      dataIndex: "maker",
      width: "10%",
      editable: true,
    },
    {
      title: "year",
      dataIndex: "year",
      width: "10%",
      editable: true,
    },
    {
      title: "engineCyl",
      dataIndex: "engineCyl",
      width: "10%",
      editable: true,
    },
    {
      title: "engine size",
      dataIndex: "engineSize",
      width: "10%",
      editable: true,
    },
    {
      title: "mpgCity",
      dataIndex: "mpgCity",
      width: "10%",
      editable: true,
    },
    {
      title: "mpgHighway",
      dataIndex: "mpgHighway",
      width: "10%",
      editable: true,
    },
    {
      title: "mpgCombined",
      dataIndex: "mpgCombined",
      width: "10%",
      editable: true,
    },
    {
      title: "rating 1-10",
      dataIndex: "rating",
      width: "5%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: unknown, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={cancel} style={{ marginRight: 8 }}>
              Cancel
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                deleteCar(record.id);
                handleDelete(record.id);
              }}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "none" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Title level={1}> Amplify + AWS SAM Application</Title>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <FormComponent onInit={onInit} />
    </>
  );
};

export default Home;
