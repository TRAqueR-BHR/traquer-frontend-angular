#!/usr/bin/env bash
# patch-primeng-templates.sh
#
# THIS SCRIPT IS NOW A NO-OP.
#
# Originally it renamed the JS-reserved word `in` used as a template reference
# variable in PrimeNG 13's pre-compiled `multiselect.mjs` and `terminal.mjs`,
# which the modern Angular template parser rejected.
#
# PrimeNG 17+ rewrote those templates and the issue no longer exists.
# Kept here as documentation; running it on a PrimeNG 22 install is a no-op.

set -euo pipefail

primeng_dir="${PRIMENG_DIR:-node_modules/primeng}"
patched=0

for dir in fesm2022 fesm2015 ; do
  for component in multiselect terminal ; do
    file="${primeng_dir}/${dir}/primeng-${component}.mjs"
    [ -f "$file" ] || continue
    if grep -q "onMouseclick(\$event,in)" "$file" 2>/dev/null; then
      sed -i 's|#in\b|inRef|g' "$file"
      sed -i 's|onMouseclick(\$event,in)|onMouseclick(\$event,inRef)|g' "$file"
      sed -i 's|focus(in)|focus(inRef)|g' "$file"
      patched=$((patched + 1))
      echo "patched $file"
    fi
  done
done

if [ "$patched" -eq 0 ]; then
  echo "No PrimeNG 13 templates found — nothing to do."
fi
