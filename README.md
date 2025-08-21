<!--
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 -->



# react-native-delightful-navigation

A library to create smooth and delightful animated transitions between screens

- [react-native-delightful-navigation](#react-native-delightful-navigation)
	- [Why Choose This Library?](#why-choose-this-library)
	- [Installation](#installation)
	- [Setup](#setup)
	- [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
	- [Usage with list and dynamic route](#usage-with-list-and-dynamic-route)
	- [Documentation](#documentation)
	- [💖 Support the Project](#-support-the-project)
	- [Ways to Contribute](#ways-to-contribute)
	- [License](#license)

## Why Choose This Library?
- **Declarative Approach:** Intuitive configuration via JSX
- **Seamless Integration:** Compatible with react-navigation and expo-router
- **Expo Ready:** Works with Managed Workflow without native configuration
- **Shared Elements:** Elegant transitions between common components

## Installation

### Prerequisites

- Expo SDK 52+
- **react-navigation** or **expo-router** already installed
- **react-native-reanimated** ^3.16.1 (v4 is not yet tested)

```sh
npm install react-native-delightful-navigation
```
or
```sh
yarn add react-native-delightful-navigation
```

## Setup

Wrap your application at the root level:

```js
import { Slot } from "expo-router"
import { FlowManager } from 'react-native-delightful-navigation';

export default function RootLayout() {
  return (
    <FlowManager>
      <Slot />
    </FlowManager>
  );
}
```

## Step-by-Step Implementation Guide

### Step 1: Initialize Navigation and configure Transition Hook

In each screen (both origin and destination):

```js
import { useNavigation } from '@react-navigation/native'; // or from 'expo-router'
import { useDelightfulTransition } from 'react-native-delightful-navigation';

const ScreenA = (props) => { 
  const navigation = useNavigation()
  const { register } = useDelightfulTransition("/screen-a")

  return <></>
}


const ScreenB = (props) => { 
  const navigation = useNavigation()
  const { register } = useDelightfulTransition("/screen-b")

  return <></>
}
```

### Step 2: Wrap Screen Content with `<Screen />` and add shared elements
In both screens: 
 - wrap with `<Screen />` 
 - add shared elements
 - add navigation prop for `<Screen />` 
 - add shared elements with the SAME tag
 - spread register into Screen component and shared elements:

```js
import { useNavigation } from '@react-navigation/native';
import { useDelightfulTransition, Screen, SharedView } from 'react-native-delightful-navigation';

const ScreenA = (props) => { 
  const navigation = useNavigation()
  const { register } = useDelightfulTransition("/screen-a")

  return (
	<Screen {...register} navigation={navigation}>
	  <SharedView {...register} tag="shared-view" style={styles.originView} />
	</Screen>
  )
}

const ScreenB = (props) => { 
  const navigation = useNavigation()
  const { register } = useDelightfulTransition("/screen-b")

  return (
	<Screen {...register} navigation={navigation}>
	  <SharedView {...register} tag="shared-view" style={styles.destinationView} />
	</Screen>
  )
}
```

### Step 3: Trigger Navigation

```js
// ScreenA
const navigation = useNavigation()
const { register, navigateWithTransition } = useDelightfulTransition("/screen-a")

const handleOnPress = () => {
  navigateWithTransition({
	destination: "/screen-b",
	navigationCallback: () => navigation.navigate("/screen-b")
	// --- or with expo-router ---
	// navigationCallback: () => router.navigate("/screen-b"),
  });
}
```

### Complete example
```js
import { useNavigation } from '@react-navigation/native';
import { useDelightfulTransition, Screen, SharedView } from 'react-native-delightful-navigation';

const ScreenA = (props) => { 
  const navigation = useNavigation()
  const { register, navigateWithTransition } = useDelightfulTransition("/screen-a")

  const handleOnPress = () => {
	navigateWithTransition({
	destination: "/screen-b",
	navigationCallback: () => navigation.navigate("/screen-b")
	// --- or with expo-router ---
	// navigationCallback: () => router.navigate("/screen-b"),
  });
}

  return (
	<Screen {...register} navigation={navigation}>
	  <SharedView {...register} tag="shared-view" style={styles.originView} />
	</Screen>
  )
}

const ScreenB = (props) => { 
  const navigation = useNavigation()
  const { register } = useDelightfulTransition("/screen-b")

  return (
	<Screen {...register} navigation={navigation}>
	  <SharedView {...register} tag="shared-view" style={styles.destinationView} />
	</Screen>
)
}
```

## Usage with list and dynamic route

### Destination route

Add dynamic route as `useDelightfulTransition`'s parameter and add dynamic tag to shared elements:

example:

```js
const { register } = useDelightfulTransition(`/details/${id}`)

// ...

<SharedView {...register} tag={`shared-view-${id}`} style={styles.view} />
```

### Origin route

Add dynamic route for shared elements:

example with `<FlatList />`:


```js
<FlatList
  renderItem={({ item }) => {
	return (
	  <Pressable onPress={() => handleNavigationToDetails(item.id)}>
		<SharedView {...register} tag={`shared-view-${id}`} style={styles.item} />
	  </Pressable>
	)
  }}
>
```

Configure dynamic route for `navigateWithTransition` function and add `itemsListToInclude`:

```js
const handleNavigationToDetails = (id) => {
  navigateWithTransition({
	destination: `/details/${id}`,
	navigationCallback: () => navigation.navigate(`/details/${id}`),
	itemsListToInclude: [`shared-view-${id}`]
  })
}
```

## Documentation
### Hooks

#### `useDelightfulTransition(route: string)`

Initialize transition screen for a specific route
 
`Return`

| Property                 | Type                   | Description                                           |
| ------------------------ | ---------------------- | ----------------------------------------------------- |
| `Register`               | `object`               | Object containing the registration methods            |
| `navigateWithTransition` | `function`             | Navigation function with animation                    |
| `transitionIsFinished`   | `SharedValue<boolean>` | Shared value to indicate when transition is finished  |
| `origin`                 | `SharedValue<string>`  | Shared value to indicate origin of current transition |


### Components

#### `<Screen />`

Container component required for each screen. 

**Props :**

| Prop          | Type        | Required | Description                                          |
| ------------- | ----------- | -------- | ---------------------------------------------------- |
| `...register` | `object`    | yes      | Spread of hook's register                            |
| `navigation`  | `object`    | yes      | Navigation object of react-navigation or expo-router |
| `children`    | `ReactNode` | yes      | Screen's content                                     |

#### `<SharedView />`, `<SharedText />` and `<SharedImage />`

Note: Shared components doesn't shared their children. If you want to share them, use shared components.

**Props :**

| Prop             | Type     | Required | Description                                          |
| ---------------- | -------- | -------- | ---------------------------------------------------- |
| `...register`    | `object` | yes      | Spread of hook's register                            |
| `tag`            | `string` | yes      | Navigation object of react-navigation or expo-router |
| `...nativeProps` | any      | no       | Native props of component (Style, etc...)            |


**Example:**

```js
<SharedView 
  {...register}
  tag="shared-view"
  style={styles.customView}
>
  <SharedImage 
    {...register} 
    tag="shared-image"
	source={source}
  />
  <SharedText {...register} tag="shared-text">
    Texte animé
  </SharedText>
</SharedView>
```
### Functions

#### `navigateWithTransition()`

**Signature**

```ts
navigateWithTransition(arg: {
  destination: string;
  navigationCallback: () => void;
  includes?: string[];
  excludes?: string[];
  itemsListToInclude?: string[];
  config?: {
	duration?: number,
	easing?: (t: number) => number
  };
}): void
```

#### **Detailed Parameters**

`destination` (required)

- **Type:** `string`
- **Description:** The route of the destination screen (must exactly match the one used in the target screen's `useDelightfulTransition`)
- **Example:** `"/details"`, `"/profile"`

`navigationCallback` (required)
- **Type:** `string`
- **Description:** Function containing the standard navigation call from your routing library
- **Example:**
```js
() => navigation.navigate('Details')
() => router.push('/details')
```

`includes` (optional)
- **Type:** `string[]`
- **Description:** Array of tag names of shared components to explicitly include in the transition (don't add if you want select all shared elements of the screen)
- **Example:** `["avatar", "title", "button"]`

`excludes` (optional)
- **Type:** `string[]`
- **Description:** Array of tag names to exclude from the transition (only if `includes` is not filled)
- **Example:** `["avatar", "title", "button"]`

`itemsListToInclude` (optional)
- **Type:** `string[]`
- **Description:** Array of dynamic tag names of list. Unlike `includes`, if you want select all shared elements, you must include them all
- **Example:** `["avatar-${id}", "title-${id}", "button-${id}"]`

`config` (optional)
- **Type:** `Object`
- **Properties:** 
  - `duration` (number): Animation duration in milliseconds (default: 500)
  - `easing` (function): Easing function that takes a number between 0-1 and returns a transformed value (default: `Easing.inOut(Easing.quad)` from Reanimated)
- **Example:**
```js
{
  duration: 600,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1)
}
```
## 💖 Support the Project

Your support is invaluable to help:

- 🔧 Maintain and improve the library

- 🐛 Fix bugs quickly

- ✨ Add new features

- 📖 Improve documentation

## Ways to Contribute

### Financial Support

- ☕ Buy me a coffee - A small gesture that makes a big difference!

### Technical Contribution

- 📖 Documentation: Help improve the usage guide

- 🐛 Bug reports: Report issues you encounter

- 💡 Ideas: Suggest new features

- 🔧 Code: Submit pull requests for improvements

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.


### Community Support

- ⭐ Star the repo on GitHub

- 📢 Share the library with others

- 💬 Join the discussion on GitHub issues

> *Every contribution, big or small, helps move the project forward!*
> 
> *Thank you for your support ! ❤️*

## License

MIT © Johan Hoareau. See [license](LICENSE.md) for details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
