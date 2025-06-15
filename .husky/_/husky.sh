#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug() {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $*"
  }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    debug " ~/.huskyrc found, sourcing..."
    . ~/.huskyrc
  fi
  export PATH="$(npm bin --quiet):$PATH"
  node --version >/dev/null 2>&1 || {
    echo "husky - Node.js is not installed, skipping $hook_name hook" >&2
    exit 0
  }
fi
