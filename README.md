# fetter
Javascript cross browser equivalency of event bind/triggering.

## Usage
### fetter
```
fetter(
    element {HTMLElement | document | window},
    event {string},
    function {function | array},
    done {string 'both'|'done'|after},
    donefunction {function}
);
```

### unfetter
```
unfetter(
    element {HTMLElement | document | window},
    event {string},
    function {function | array}
);
```

## Issues

* Should be able to add multiple elements rather than just one,
* Should be able to supply with a single object not just the multiple args,
* Not tested in IE 6 and below
* Collate proper cross-browser testing, tested in ie 7-10, mozilla and webkit.
