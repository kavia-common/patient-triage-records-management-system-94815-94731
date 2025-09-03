#!/bin/bash
cd /home/kavia/workspace/code-generation/patient-triage-records-management-system-94815-94731/backend_triagens
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

