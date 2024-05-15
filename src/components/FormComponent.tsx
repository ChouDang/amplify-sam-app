import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import { postCar } from "../api/apiEndPoints";

type LayoutType = Parameters<typeof Form>[0]["layout"];
type NotificationType = "success" | "info" | "warning" | "error";

interface FormValueProps {
  model: string;
  maker: string;
  engineCyl: string;
  rating: string;
  mpgHighway: string;
  year: string;
  id: string;
  mpgCity: string;
  mpgCombined: string;
  engineSize: string;
}

const fields = [
  { label: "Car Model", name: "model" },
  { label: "Car Maker", name: "maker" },
  { label: "Year", name: "year" },
  { label: "Engine Cylinder", name: "engineCyl" },
  { label: "Engine Size", name: "engineSize" },
  { label: "MPG City", name: "mpgCity" },
  { label: "MPG Highway", name: "mpgHighway" },
  { label: "MPG Combined", name: "mpgCombined" },
  { label: "Rating", name: "rating" },
];

const FormComponent: React.FC<{onInit?: () => void}> = ({onInit = () => {}}) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: type === "success" ? "Notification" : "Alert",
      description:
        type === "success"
          ? "The form is submitted successfully!"
          : "An error has occurred! Please try again!",
    });
  };

  const formItemLayout =
    formLayout === "horizontal"
      ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
      : null;

  const buttonItemLayout =
    formLayout === "horizontal"
      ? { wrapperCol: { span: 14, offset: 4 } }
      : null;

  const onFinish = async (values: FormValueProps) => {
    console.log("Received values of form: ", values);
    try {
      await postCar(values);
      form.resetFields();
      openNotificationWithIcon("success");
      onInit()
    } catch (error) {
      console.error("Error while submitting: ", error);
      openNotificationWithIcon("error");
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
        onFinish={onFinish}
      >
        {fields.map(field => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={[{ required: true, message: "Please input a value" }]}
          >
            <Input />
          </Form.Item>
        ))}
        <Form.Item {...buttonItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormComponent;