'use client';
import { EditOutlined, NumberOutlined } from '@ant-design/icons';
import { useDisclosure } from '@mantine/hooks';
import { Input } from 'antd';
import React from 'react';
import ButtonSmall from '../Button/ButtonSmall';

export default function InputIntent({ item, info, onChange, children }: any) {
  const [opened, handlers] = useDisclosure(false);

  return (
    <>
      <NumberOutlined
        type="primary"
        style={{ color: !opened ? '#8c8c8c' : 'black' }}
      />
      <Input
        value={item}
        placeholder="Borderless"
        variant="borderless"
        disabled={!opened}
        onChange={onChange}
      />
      <ButtonSmall
        info={info}
        onClick={() => {
          opened ? handlers.close() : handlers.open();
        }}
        positionTooltip="bottomRight"
        icon={
          <EditOutlined
            style={{ fontSize: '16px', color: '#4942E4' }}
            className=""
          />
        }
      />
      {children}
    </>
  );
}
