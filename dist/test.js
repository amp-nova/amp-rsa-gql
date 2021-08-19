"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const async = require('async');
const assert = require('assert');
const chalk = require('chalk');
const nconf = require('nconf');
const axios = require('axios');
const index_1 = __importDefault(require("./index"));
let backendKeys = [];
// command line arguments
const graphqlHost = nconf.argv().get('graphqlHost') || `http://localhost:3002`;
const graphqlUrl = `${graphqlHost}/graphql`;
let run = async () => {
    console.log(`Testing against server ${chalk.bgBlueBright(graphqlUrl)}`);
    console.log();
    let bkResponse = await axios.get(`${graphqlHost}/keys`);
    backendKeys = bkResponse.data.keys;
    backendKeys = [_.first(backendKeys)];
    async.eachSeries(backendKeys, async (backendKey) => {
        let client = index_1.default({ graphqlUrl, backendKey });
        let mapped = {};
        let flattenCategories = cats => {
            _.each(cats, cat => {
                mapped[cat.id] = cat;
                flattenCategories(cat.children);
            });
        };
        console.log();
        console.log(chalk.gray(backendKey));
        console.log('-'.padStart(backendKey.length, '-'));
        console.log();
        let productsResponse = await client.fetchAllProducts();
        console.log(`    products:         [ ${chalk.magenta(productsResponse.meta.total)} ]`);
        let product = _.sample(productsResponse.results);
        let topLevelCategories = await client.fetchCategoryHierarchy();
        flattenCategories(topLevelCategories);
        let secondLevelCategories = _.flatten(_.map(topLevelCategories, 'children'));
        let thirdLevelCategories = _.flatten(_.map(secondLevelCategories, 'children'));
        console.log(`    categories (top): [ ${chalk.magenta(topLevelCategories.length)} ]`);
        console.log(`               (2nd): [ ${chalk.magenta(secondLevelCategories.length)} ]`);
        console.log(`               (3rd): [ ${chalk.magenta(thirdLevelCategories.length)} ]`);
        console.log();
        let category = _.sample(Object.values(mapped));
        process.stdout.write(`    lookup category [ id: ${chalk.yellow(category.id)} ]...`);
        let categoryById = await client.fetchCategory({ id: category.id });
        assert.deepStrictEqual(_.omit(categoryById, ['children', 'products']), _.omit(category, ['children', 'products']));
        console.log(`[ ${chalk.green('pass')} ]`);
        process.stdout.write(`    lookup category [ slug: ${chalk.yellow(category.slug)} ]...`);
        let categoryBySlug = await client.fetchCategory({ slug: category.slug });
        assert.deepStrictEqual(_.omit(categoryBySlug, ['children', 'products']), _.omit(category, ['children', 'products']));
        console.log(`[ ${chalk.green('pass')} ]`);
        process.stdout.write(`    lookup product  [ id: ${chalk.yellow(product.id)} ]...`);
        let productById = await client.fetchProduct({ id: product.id });
        assert.deepStrictEqual(_.omit(productById, 'categories'), _.omit(product, 'categories'));
        console.log(`[ ${chalk.green('pass')} ]`);
    });
};
run();
