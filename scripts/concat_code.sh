#!/bin/bash
# Script to concatenate all relevant code files for LLM/AI agent review
# Adapted for Astro/Tailwind/TypeScript projects
# Usage: ./scripts/concat_code.sh [options]
# Options:
#   --include-tests     Include test files (excluded by default)
#   --include-docs      Include documentation files (included by default, use --include-docs=false to exclude)
#   --include-html      Include HTML template files (excluded by default)
#   --include-locales   Include locale JSON files (included by default)
#   --max-size KB       Maximum file size in KB (default: 500, 0 = no limit)
#   --output FILE       Output file path (default: code_dump.txt in project root)
#   --base-dir DIR      Base directory to start search from (default: project root)

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
INCLUDE_TESTS=false
INCLUDE_DOCS=true
INCLUDE_HTML=false
INCLUDE_LOCALES=true
MAX_SIZE_KB=500  # Default: exclude files larger than 500KB
OUTPUT_FILE=""
BASE_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --include-tests)
      INCLUDE_TESTS=true
      shift
      ;;
    --include-docs)
      INCLUDE_DOCS=true
      shift
      ;;
    --include-docs=false)
      INCLUDE_DOCS=false
      shift
      ;;
    --include-html)
      INCLUDE_HTML=true
      shift
      ;;
    --include-html=false)
      INCLUDE_HTML=false
      shift
      ;;
    --include-locales)
      INCLUDE_LOCALES=true
      shift
      ;;
    --include-locales=false)
      INCLUDE_LOCALES=false
      shift
      ;;
    --max-size)
      MAX_SIZE_KB="$2"
      shift 2
      ;;
    --output)
      OUTPUT_FILE="$2"
      shift 2
      ;;
    --base-dir)
      BASE_DIR="$2"
      shift 2
      ;;
    -*)
      echo -e "${YELLOW}Unknown option: $1${NC}" >&2
      echo "Usage: $0 [--include-tests] [--include-docs] [--include-docs=false] [--include-html] [--include-locales] [--max-size KB] [--output FILE] [--base-dir DIR]"
      exit 1
      ;;
    *)
      echo -e "${YELLOW}Unexpected argument: $1${NC}" >&2
      echo "Usage: $0 [--include-tests] [--include-docs] [--include-docs=false] [--include-html] [--include-locales] [--max-size KB] [--output FILE] [--base-dir DIR]"
      exit 1
      ;;
  esac
done

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Set defaults if not provided
BASE_DIR="${BASE_DIR:-$PROJECT_ROOT}"
OUTPUT_FILE="${OUTPUT_FILE:-$PROJECT_ROOT/code_dump.txt}"

# Convert Windows-style paths to Unix-style for Git Bash
BASE_DIR=$(echo "$BASE_DIR" | sed 's|\\|/|g' | tr -d '\r\n')
OUTPUT_FILE=$(echo "$OUTPUT_FILE" | sed 's|\\|/|g' | tr -d '\r\n')

# Get absolute paths
if [ -d "$BASE_DIR" ]; then
  BASE_DIR=$(cd "$BASE_DIR" && pwd 2>/dev/null | tr -d '\r\n' || echo "$BASE_DIR")
  BASE_DIR=$(echo "$BASE_DIR" | sed 's|\\|/|g' | tr -d '\r\n')
fi

# Make OUTPUT_FILE absolute if it's relative
if [[ "$OUTPUT_FILE" != /* ]] && [[ "$OUTPUT_FILE" != [A-Za-z]:* ]]; then
  OUTPUT_FILE="$PROJECT_ROOT/$OUTPUT_FILE"
fi

# Validate directory exists
if [ ! -d "$BASE_DIR" ]; then
  echo -e "${YELLOW}Error: Directory not found: $BASE_DIR${NC}" >&2
  exit 1
fi

echo -e "${BLUE}=== Astro Code Concatenation Script ===${NC}"
echo "Base directory: $BASE_DIR"
echo "Output file: $OUTPUT_FILE"
echo "Include tests: $INCLUDE_TESTS"
echo "Include docs: $INCLUDE_DOCS"
echo "Include HTML: $INCLUDE_HTML"
echo "Include locales: $INCLUDE_LOCALES"
echo "Max file size: ${MAX_SIZE_KB}KB"
echo ""

# Temporary file to collect file paths
TEMP_FILE=$(mktemp)
trap "rm -f '$TEMP_FILE'" EXIT

# Function to check if file should be excluded
should_exclude_file() {
  local file_path="$1"
  local file_name=$(basename "$file_path")
  
  # Exclude node_modules
  if [[ "$file_path" == */node_modules/* ]]; then
    return 0
  fi
  
  # Exclude build/dist directories
  if [[ "$file_path" == */dist/* ]] || [[ "$file_path" == */dist-ssr/* ]] || [[ "$file_path" == */.astro/* ]] || [[ "$file_path" == */.next/* ]]; then
    return 0
  fi
  
  # Exclude .git directory
  if [[ "$file_path" == */.git/* ]]; then
    return 0
  fi
  
  # Exclude test results and reports
  if [[ "$file_path" == */test-results/* ]] || [[ "$file_path" == */playwright-report/* ]] || [[ "$file_path" == */playwright/.cache/* ]]; then
    return 0
  fi
  
  # Exclude test files if not including tests
  if [ "$INCLUDE_TESTS" = false ]; then
    if [[ "$file_name" == *.test.ts ]] || \
       [[ "$file_name" == *.test.tsx ]] || \
       [[ "$file_name" == *.test.js ]] || \
       [[ "$file_name" == *.test.jsx ]] || \
       [[ "$file_name" == *.spec.ts ]] || \
       [[ "$file_name" == *.spec.tsx ]] || \
       [[ "$file_path" == */__tests__/* ]] || \
       [[ "$file_path" == */tests/* ]] || \
       [[ "$file_path" == */test/* ]]; then
      return 0
    fi
  fi
  
  # Exclude HTML files if not including HTML
  if [ "$INCLUDE_HTML" = false ] && [[ "$file_path" == *.html ]]; then
    # Allow HTML in templates directory structure check, but exclude if option is false
    if [[ "$file_path" != */src/templates/* ]]; then
      return 0
    fi
    # Still exclude even in templates if flag is false
    return 0
  fi
  
  # Exclude locale JSON files if not including locales
  if [ "$INCLUDE_LOCALES" = false ] && [[ "$file_path" == */locales/*.json ]] || [[ "$file_path" == */src/locales/*.json ]]; then
    return 0
  fi
  
  return 1
}

# Function to get file type
get_file_type() {
  local file_path="$1"
  local file_name=$(basename "$file_path")
  
  if [[ "$file_path" == *.astro ]]; then
    echo "Astro"
  elif [[ "$file_path" == *.ts ]] && [[ "$file_path" != *.tsx ]]; then
    if [[ "$file_path" == *.test.ts ]] || [[ "$file_path" == *.spec.ts ]]; then
      echo "TypeScript Test"
    else
      echo "TypeScript"
    fi
  elif [[ "$file_path" == *.tsx ]]; then
    if [[ "$file_path" == *.test.tsx ]] || [[ "$file_path" == *.spec.tsx ]]; then
      echo "TypeScript React Test"
    else
      echo "TypeScript React"
    fi
  elif [[ "$file_path" == *.js ]] && [[ "$file_path" != *.jsx ]] && [[ "$file_path" != *.mjs ]] && [[ "$file_path" != *.cjs ]]; then
    echo "JavaScript"
  elif [[ "$file_path" == *.jsx ]]; then
    echo "JavaScript React"
  elif [[ "$file_path" == *.mjs ]]; then
    echo "JavaScript Module"
  elif [[ "$file_path" == *.cjs ]]; then
    echo "JavaScript CommonJS"
  elif [[ "$file_path" == *.md ]] || [[ "$file_path" == *.mdx ]]; then
    echo "Markdown"
  elif [[ "$file_path" == *.json ]]; then
    if [[ "$file_path" == package.json ]]; then
      echo "Package Config"
    elif [[ "$file_path" == package-lock.json ]] || [[ "$file_path" == yarn.lock ]] || [[ "$file_path" == pnpm-lock.yaml ]]; then
      echo "Lock File"
    elif [[ "$file_path" == tsconfig.json ]] || [[ "$file_path" == *tsconfig*.json ]]; then
      echo "TypeScript Config"
    elif [[ "$file_path" == */locales/*.json ]] || [[ "$file_path" == */src/locales/*.json ]]; then
      echo "Locale JSON"
    else
      echo "JSON"
    fi
  elif [[ "$file_path" == *.html ]]; then
    echo "HTML"
  elif [[ "$file_path" == *.css ]]; then
    echo "CSS"
  elif [[ "$file_path" == astro.config.* ]]; then
    echo "Astro Config"
  elif [[ "$file_path" == vite.config.* ]]; then
    echo "Vite Config"
  elif [[ "$file_path" == tailwind.config.* ]]; then
    echo "Tailwind Config"
  elif [[ "$file_path" == playwright.config.* ]]; then
    echo "Playwright Config"
  elif [[ "$file_path" == postcss.config.* ]]; then
    echo "PostCSS Config"
  elif [[ "$file_path" == Dockerfile ]] || [[ "$file_path" == *Dockerfile* ]]; then
    echo "Docker"
  elif [[ "$file_path" == docker-compose.yml ]] || [[ "$file_path" == docker-compose*.yml ]]; then
    echo "Docker Compose"
  elif [[ "$file_path" == .env.example ]] || [[ "$file_path" == *.env.example ]]; then
    echo "Environment Example"
  elif [[ "$file_path" == .prettierrc ]] || [[ "$file_path" == prettier.config.* ]]; then
    echo "Prettier Config"
  elif [[ "$file_path" == .eslintrc.* ]] || [[ "$file_path" == eslint.config.* ]]; then
    echo "ESLint Config"
  elif [[ "$file_path" == Makefile ]]; then
    echo "Makefile"
  elif [[ "$file_path" == *.yml ]] || [[ "$file_path" == *.yaml ]]; then
    if [[ "$file_path" == */.github/workflows/* ]]; then
      echo "GitHub Workflow"
    else
      echo "YAML"
    fi
  elif [[ "$file_path" == *.sh ]]; then
    echo "Shell Script"
  else
    echo "Unknown"
  fi
}

# Function to get comment prefix
get_comment_prefix() {
  local file_path="$1"
  
  if [[ "$file_path" == *.astro ]]; then
    echo "<!--"
  elif [[ "$file_path" == *.html ]]; then
    echo "<!--"
  elif [[ "$file_path" == *.md ]] || [[ "$file_path" == *.mdx ]]; then
    echo "<!--"
  elif [[ "$file_path" == *.css ]]; then
    echo "/*"
  elif [[ "$file_path" == Dockerfile ]] || [[ "$file_path" == Makefile ]] || [[ "$file_path" == *.sh ]]; then
    echo "#"
  else
    echo "//"
  fi
}

# Function to get comment suffix
get_comment_suffix() {
  local file_path="$1"
  
  if [[ "$file_path" == *.astro ]] || [[ "$file_path" == *.html ]] || [[ "$file_path" == *.md ]] || [[ "$file_path" == *.mdx ]]; then
    echo "-->"
  elif [[ "$file_path" == *.css ]]; then
    echo "*/"
  else
    echo ""
  fi
}

# Common prune directories pattern - using -prune prevents find from descending into these directories
# This is much faster than using -path exclusions because find doesn't even traverse these trees
find_with_prune() {
  local search_dir="${1:-$BASE_DIR}"
  shift  # Remove first arg, rest are find patterns for files
  find "$search_dir" \
    -type d \( -name node_modules -o -name .git -o -name .next -o -name dist -o -name dist-ssr -o -name .astro -o -name build -o -name vendor -o -name .cache -o -name coverage -o -name .coverage -o -name htmlcov -o -name .pytest_cache -o -name .nyc_output -o -name test-results -o -name playwright-report -o -name playwright -o -name .turbo -o -name .vercel -o -name out -o -name .svelte-kit -o -name storybook-static -o -name .pnpm-store -o -name .yarn -o -name __pycache__ -o -name .mypy_cache -o -name .tox -o -name .nox -o -name .hypothesis -o -name .pyre -o -name .pytype -o -name cython_debug -o -name .terraform -o -name .gcloud -o -name .idea -o -name .vscode -o -name .scrapy -o -name .ipynb_checkpoints -o -name .sentry -o -name tmp -o -name temp -o -name .tmp -o -name .temp \) -prune -o \
    -type f "$@" -print
}

# Find all Astro files
echo -e "${BLUE}Finding Astro files...${NC}"
find_with_prune "$BASE_DIR" -name "*.astro" | while read -r file; do
  if ! should_exclude_file "$file"; then
    echo "$file" >> "$TEMP_FILE"
  fi
done

# Find TypeScript/JavaScript files
echo -e "${BLUE}Finding TypeScript/JavaScript files...${NC}"
find_with_prune "$BASE_DIR" \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" -o -name "*.cjs" \) | while read -r file; do
  if ! should_exclude_file "$file"; then
    echo "$file" >> "$TEMP_FILE"
  fi
done

# Find Markdown files (content and documentation)
if [ "$INCLUDE_DOCS" = true ]; then
  echo -e "${BLUE}Finding Markdown files...${NC}"
  find_with_prune "$BASE_DIR" \( -name "*.md" -o -name "*.mdx" \) | while read -r file; do
    if ! should_exclude_file "$file"; then
      echo "$file" >> "$TEMP_FILE"
    fi
  done
fi

# Find HTML template files
if [ "$INCLUDE_HTML" = true ]; then
  echo -e "${BLUE}Finding HTML files...${NC}"
  find_with_prune "$BASE_DIR" -name "*.html" | while read -r file; do
    if ! should_exclude_file "$file"; then
      echo "$file" >> "$TEMP_FILE"
    fi
  done
fi

# Find CSS files
echo -e "${BLUE}Finding CSS files...${NC}"
find_with_prune "$BASE_DIR" -name "*.css" | while read -r file; do
  if ! should_exclude_file "$file"; then
    echo "$file" >> "$TEMP_FILE"
  fi
done

# Find JSON files (locales, configs, etc.)
echo -e "${BLUE}Finding JSON files...${NC}"
find_with_prune "$BASE_DIR" -name "*.json" | while read -r file; do
  if ! should_exclude_file "$file"; then
    # Skip lock files
    if [[ "$file" != */package-lock.json ]] && [[ "$file" != */yarn.lock ]] && [[ "$file" != */pnpm-lock.yaml ]]; then
      echo "$file" >> "$TEMP_FILE"
    fi
  fi
done

# Find configuration files
echo -e "${BLUE}Finding configuration files...${NC}"

# package.json files
find_with_prune "$BASE_DIR" -name "package.json" >> "$TEMP_FILE"

# Astro configs
find_with_prune "$BASE_DIR" -name "astro.config.*" >> "$TEMP_FILE"

# Vite configs
find_with_prune "$BASE_DIR" -name "vite.config.*" >> "$TEMP_FILE"

# Tailwind configs
find_with_prune "$BASE_DIR" -name "tailwind.config.*" >> "$TEMP_FILE"

# PostCSS configs
find_with_prune "$BASE_DIR" -name "postcss.config.*" >> "$TEMP_FILE"

# TypeScript configs
find_with_prune "$BASE_DIR" -name "tsconfig*.json" >> "$TEMP_FILE"

# Playwright configs (only if including tests)
if [ "$INCLUDE_TESTS" = true ]; then
  find_with_prune "$BASE_DIR" -name "playwright.config.*" >> "$TEMP_FILE"
fi

# Docker files
find_with_prune "$BASE_DIR" \( -name "Dockerfile*" -o -name "docker-compose*.yml" -o -name "docker-compose*.yaml" \) >> "$TEMP_FILE"

# Environment example files
find_with_prune "$BASE_DIR" \( -name ".env.example" -o -name ".env.local.example" -o -name "*.env.example" \) >> "$TEMP_FILE"

# Linter and formatter configs
find_with_prune "$BASE_DIR" \( -name ".prettierrc*" -o -name "prettier.config.*" -o -name ".eslintrc.*" -o -name "eslint.config.*" \) >> "$TEMP_FILE"

# Makefiles
find_with_prune "$BASE_DIR" -name "Makefile" >> "$TEMP_FILE"

# Shell scripts
find_with_prune "$BASE_DIR" -name "*.sh" >> "$TEMP_FILE"

# CI/CD files
find_with_prune "$BASE_DIR" \( -path "*/.github/workflows/*.yml" -o -path "*/.github/workflows/*.yaml" \) >> "$TEMP_FILE"

# Documentation files (if included)
if [ "$INCLUDE_DOCS" = true ]; then
  echo -e "${BLUE}Finding documentation files...${NC}"
  
  # README files
  find_with_prune "$BASE_DIR" -name "README.md" >> "$TEMP_FILE"
  
  # Files in docs/ directory (only if it exists)
  if [ -d "$BASE_DIR/docs" ]; then
    find_with_prune "$BASE_DIR/docs" -name "*.md" 2>/dev/null >> "$TEMP_FILE" || true
  fi
fi

# Sort and remove duplicates
sort -u "$TEMP_FILE" > "${TEMP_FILE}.sorted"
mv "${TEMP_FILE}.sorted" "$TEMP_FILE"

# Count files
FILE_COUNT=$(wc -l < "$TEMP_FILE" | tr -d ' ')
if [ "$FILE_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}Warning: No files found${NC}" >&2
  exit 1
fi

echo "Found $FILE_COUNT files"
echo ""

# Create output file with header
{
  echo "// ============================================================================"
  echo "// Code Dump for AI Agent Review - Astro/Tailwind Project"
  echo "// ============================================================================"
  echo "// Base directory: $BASE_DIR"
  echo "// Generated: $(date)"
  echo "// Files found: $FILE_COUNT"
  echo "// Options: include-tests=$INCLUDE_TESTS, include-docs=$INCLUDE_DOCS, include-html=$INCLUDE_HTML, include-locales=$INCLUDE_LOCALES, max-size=${MAX_SIZE_KB}KB"
  echo "// ============================================================================"
  echo ""
} > "$OUTPUT_FILE"

# Process each file
CURRENT_FILE=0
INCLUDED_FILE_COUNT=0
EXCLUDED_SIZE_COUNT=0

while IFS= read -r FILE_PATH; do
  CURRENT_FILE=$((CURRENT_FILE + 1))
  
  # Get relative path from base directory
  if [[ "$FILE_PATH" == "$BASE_DIR"/* ]]; then
    REL_PATH="${FILE_PATH#$BASE_DIR/}"
  elif [[ "$FILE_PATH" == "$BASE_DIR" ]]; then
    REL_PATH=$(basename "$FILE_PATH")
  else
    REL_PATH="$FILE_PATH"
  fi
  
  # Normalize path separators
  REL_PATH=$(echo "$REL_PATH" | sed 's|\\|/|g')
  
  # Check file size and skip if too large (if MAX_SIZE_KB > 0)
  if [ "$MAX_SIZE_KB" != "0" ]; then
    FILE_SIZE_BYTES=$(wc -c < "$FILE_PATH" 2>/dev/null || echo "0")
    FILE_SIZE_KB=$((FILE_SIZE_BYTES / 1024))
    if [ "$FILE_SIZE_KB" -gt "$MAX_SIZE_KB" ]; then
      echo -e "${YELLOW}[$CURRENT_FILE/$FILE_COUNT] Skipping large file (${FILE_SIZE_KB}KB > ${MAX_SIZE_KB}KB): $REL_PATH${NC}"
      EXCLUDED_SIZE_COUNT=$((EXCLUDED_SIZE_COUNT + 1))
      continue
    fi
  fi
  
  FILE_TYPE=$(get_file_type "$FILE_PATH")
  COMMENT_PREFIX=$(get_comment_prefix "$FILE_PATH")
  COMMENT_SUFFIX=$(get_comment_suffix "$FILE_PATH")
  
  echo -e "${GREEN}[$CURRENT_FILE/$FILE_COUNT]${NC} Adding $FILE_TYPE: $REL_PATH"
  INCLUDED_FILE_COUNT=$((INCLUDED_FILE_COUNT + 1))
  
  # Add file separator comment
  {
    echo ""
    if [ -n "$COMMENT_SUFFIX" ]; then
      echo "$COMMENT_PREFIX ============================================================================$COMMENT_SUFFIX"
      echo "$COMMENT_PREFIX FILE: $REL_PATH$COMMENT_SUFFIX"
      echo "$COMMENT_PREFIX Type: $FILE_TYPE$COMMENT_SUFFIX"
      echo "$COMMENT_PREFIX ============================================================================$COMMENT_SUFFIX"
    else
      echo "$COMMENT_PREFIX ============================================================================"
      echo "$COMMENT_PREFIX FILE: $REL_PATH"
      echo "$COMMENT_PREFIX Type: $FILE_TYPE"
      echo "$COMMENT_PREFIX ============================================================================"
    fi
    echo ""
    cat "$FILE_PATH"
    echo ""
  } >> "$OUTPUT_FILE"
  
done < "$TEMP_FILE"

# Add footer
{
  echo ""
  echo "// ============================================================================"
  echo "// End of Code Dump"
  echo "// Total files found: $FILE_COUNT"
  echo "// Total files included: $INCLUDED_FILE_COUNT"
  echo "// Files excluded due to size: $EXCLUDED_SIZE_COUNT"
  echo "// Files excluded due to filters: $((FILE_COUNT - INCLUDED_FILE_COUNT - EXCLUDED_SIZE_COUNT))"
  echo "// ============================================================================"
} >> "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✓ Successfully concatenated $INCLUDED_FILE_COUNT files to $OUTPUT_FILE${NC}"
echo -e "${GREEN}  (Found $FILE_COUNT total, excluded $((FILE_COUNT - INCLUDED_FILE_COUNT)) due to filters and size limits)${NC}"
