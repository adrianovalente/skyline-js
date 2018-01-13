# skyline-js

[![Build Status](https://travis-ci.com/adrianovalente/skyline.svg?token=sXzfpyZgxDGcjGqaejqQ&branch=master)](https://travis-ci.com/adrianovalente/skyline)

> Check out your Skyline inbox with native javascript

This is a Node.JS interface that connects to the SkyLine API, allowing you to check you inbox without having to run any binary file

## Getting Started
To add this module as a dependency to your project, you can simply `npm install` it:

``` bash
npm install --save skyline-js
```

## Example
Here is an example of how to use this tool to get your inbox messages:

``` javascript
import Skyline from 'skyline-js'

const skyline = new Skyline({
  username: 'my-skyline-login',
  password: 'my-skyline-password'
})

skyline.getMessages({
  from: '2018-01-02', // default is today
  to: '2018-01-04'    // default is today,

  onlyDownloadHeaders: true // default is false
}).then(messages => {
  console.log(messages)
})

```

## Contributing

This project is licensed under the [MIT](./LICENSE) license.

Please feel free to open issues and pull requests and help documenting code!
