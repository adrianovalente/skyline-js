# Nexxera Connector
This is a Node.js interface that connects to Nexxera API, allowing you to check you inbox natively using only javascript code.

## Getting Started
To add this module as a dependency to your project, you can simply `npm install` it:

``` bash
npm install --save nexxera-connector
```

## Example
Here is an example of how to use this tool to get your inbox messages:

``` javascript
import Nexxera from 'nexxera-connector'

const nexxera = new Nexxera({
  username: 'my-nexxera-login',
  password: 'my-nexxera-password'
})

nexxera.getMessages({
  from: '2018-01-02',
  to: '2018-01-04'
}).then(messages => {
  console.log(messages)
})

```

## Distributing and Contributing

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.

Please feel free to open issues and pull requests and help documenting code!