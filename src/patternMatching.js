/**
 * Check if a key matches a pattern and extract parameters.
 * Patterns can include parameter placeholders in the form {paramName}.
 * @param {string} pattern - The pattern to match against (e.g., "user:{id}/posts:{postId}").
 * @param {string} key - The key to check for a match.
 * @returns {{match: boolean, params?: Object, key?: string}} Match result containing:
 *   - match: true if the key matches the pattern
 *   - params: object with extracted parameter values (if match is true)
 *   - key: the original key (if match is true)
 */
function checkForMatch(pattern, key) {
  const regex = pattern.replace(/{(.*?)}/g, "(?<$1>.*?)");
  const match = key.match(new RegExp(`^${regex}$`));

  if (!match) {
    return { match: false };
  }

  const params = {};
  const groupNames = Object.keys(match.groups || {});
  for (const groupName of groupNames) {
    params[groupName] = match.groups[groupName];
  }

  return {
    match: true,
    params,
    key,
  };
}

/**
 * Validate that a key pattern is well-formed.
 * Checks for duplicate parameter names, unnamed parameters, and nested parameters.
 * @param {string} pattern - The pattern to validate (e.g., "user:{id}/posts:{postId}").
 * @returns {boolean} true if the pattern is valid, false otherwise.
 */
function keyPatternIsValid(pattern) {
  const parameterNames = pattern.match(/{(.*?)}/g);
  if (!parameterNames) {
    return true;
  } // No parameters found, so it's valid

  const uniqueNames = new Set(parameterNames.map((name) => name.slice(1, -1)));
  if (uniqueNames.size !== parameterNames.length) {
    return false;
  } // duplicate names
  if (parameterNames.some((name) => name === "{}")) {
    return false;
  } // unnamed parameter
  if (
    parameterNames.some((name) => {
      const paramName = name.slice(1, -1);
      return paramName.includes("{") || paramName.includes("}");
    })
  ) {
    // nested parameters
    return false;
  }

  return true;
}

export { checkForMatch, keyPatternIsValid };
