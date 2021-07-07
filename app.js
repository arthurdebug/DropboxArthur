const express = require('express');
const upload = require('express-fileupload');
const fs = require("fs");
const path = require("path");

let cache = {}
