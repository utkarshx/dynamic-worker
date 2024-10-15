import _ from 'underscore';

export default async function hello() {
    const sum = _.reduce([1, 2], (memo, num) => memo + num, 0);
    return `The sum is: ${sum}`;
}