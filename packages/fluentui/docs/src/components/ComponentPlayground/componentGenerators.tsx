import { useStringKnob } from '@fluentui/docs-components';
import {
  AvatarProps,
  BoxProps,
  CardProps,
  DialogProps,
  DividerProps,
  EmbedProps,
  ImageProps,
  VideoProps,
  Avatar as _Avatar,
  CardBody as _CardBody,
  CardHeader as _CardHeader,
  Flex as _Flex,
  Text as _Text,
} from '@fluentui/react-northstar';
import * as _ from 'lodash';
import * as faker from 'faker';
import * as React from 'react';

import { KnobComponentGenerators } from '../../types';
import { number } from '../ComponentPlayground/typeGenerators';

export const Avatar: KnobComponentGenerators<AvatarProps> = {
  name: ({ propName }) => ({
    hook: useStringKnob,
    name: propName,
    initialValue: _.capitalize(`${faker.name.firstName()} ${faker.name.lastName()}`),
  }),
};

export const Box: KnobComponentGenerators<BoxProps> = {
  // TODO: fix support for boxes
  children: () => null,
};

export const Card: KnobComponentGenerators<CardProps> = {
  children: () => {
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const jobTitle = faker.name.jobTitle();
    const content = faker.lorem.paragraph();

    return {
      name: null,
      hook: () => [
        [
          <_CardHeader key="header">
            <_Flex gap="gap.small">
              <_Avatar image="public/images/avatar/small/matt.jpg" label={jobTitle} name={name} status="unknown" />
              <_Flex column>
                <_Text content={name} weight="bold" />
                <_Text content={jobTitle} size="small" />
              </_Flex>
            </_Flex>
          </_CardHeader>,
          <_CardBody key="body">{content}</_CardBody>,
        ],
      ],
    };
  },
  // disable horizontal as it requires different layout
  horizontal: () => null,
};

export const Dialog: KnobComponentGenerators<DialogProps> = {
  footer: () => null,
};

export const Divider: KnobComponentGenerators<DividerProps> = {
  // Workaround for `Divider` component that supports size in different way
  size: number,
};

export const Embed: KnobComponentGenerators<EmbedProps> = {
  placeholder: ({ componentInfo, propName }) => ({
    hook: useStringKnob,
    name: propName,
    initialValue: 'https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p-5s/master/poster.jpg',
  }),
  // Hack until `size` prop will not supported
  variables: () => ({
    hook: () => [{ width: '480px' }],
    name: 'variables',
  }),
};

export const Image: KnobComponentGenerators<ImageProps> = {
  src: ({ propName }) => ({
    hook: useStringKnob,
    name: propName,
    initialValue: faker.image.avatar(),
  }),
};

export const Video: KnobComponentGenerators<VideoProps> = {
  poster: ({ componentInfo, propName }) => ({
    hook: useStringKnob,
    name: propName,
    initialValue: 'public/images/tears-of-steel.jpg',
  }),
  src: ({ propName }) => ({
    hook: useStringKnob,
    name: propName,
    initialValue: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  }),
  // Hack until `size` prop will not supported
  variables: () => ({
    hook: () => [{ height: '300px', width: '720px' }],
    name: 'variables',
  }),
};
