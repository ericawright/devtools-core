/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @flow

import type {
  ReduxAction,
  State,
} from "./types";

import {getValue} from "./utils/node";

module.exports = (
  state: State = {},
  action: ReduxAction
) : State => {
  const {
    type,
    data,
  } = action;

  if (type === "NODE_EXPAND") {
    return Object.assign({}, state, {
      expandedPaths: new Set(state.expandedPaths).add(data.node.path)
    });
  }

  if (type === "NODE_PROPERTIES_LOADED") {
    // Let's loop through the responses to build a single object.
    const properties = data.responses.reduce((accumulator, res) => {
      Object.entries(res).forEach(([k, v]) => {
        if (accumulator.hasOwnProperty(k)) {
          if (Array.isArray(accumulator[k])) {
            accumulator[k].push(...v);
          } else if (typeof accumulator[k] === "object") {
            accumulator[k] = Object.assign({}, accumulator[k], v);
          }
        } else {
          accumulator[k] = v;
        }
      });
      return accumulator;
    }, {});

    return Object.assign({}, state, {
      loadedProperties: (new Map(state.loadedProperties))
        .set(data.node.path, properties),
    });
  }

  if (type === "NODE_COLLAPSE") {
    const expandedPaths = new Set(state.expandedPaths);
    expandedPaths.delete(data.node.path);
    return Object.assign({}, state, {expandedPaths});
  }

  if (type === "NODE_FOCUS") {
    return Object.assign({}, state, {
      focusedItem: data.node
    });
  }

  return state;
};
