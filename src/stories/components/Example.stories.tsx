import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Example } from '../../components';

export default {
  title: 'Components/Example',
  component: Example,
  argTypes: {},
  tags: ['autodocs'],
} as Meta<typeof Example>;

const Template: StoryFn<typeof Example> = (args) => <Example {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Clicked this many times:',
};
