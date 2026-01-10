# Script to concatenate all relevant code files for LLM/AI agent review
# Adapted for Astro/Tailwind/TypeScript projects
# Usage: .\scripts\concat_code.ps1 [options]
# Options:
#   -IncludeTests     Include test files (excluded by default)
#   -IncludeDocs      Include documentation files (included by default, use -IncludeDocs:$false to exclude)
#   -IncludeHtml      Include HTML template files (excluded by default)
#   -IncludeLocales   Include locale JSON files (included by default)
#   -MaxSizeKB        Maximum file size in KB (default: 500, 0 = no limit)
#   -OutputFile       Output file path (default: code_dump.txt in project root)
#   -BaseDir          Base directory to start search from (default: project root)

param(
    [switch]$IncludeTests = $false,
    [bool]$IncludeDocs = $true,
    [bool]$IncludeHtml = $false,
    [bool]$IncludeLocales = $true,
    [int]$MaxSizeKB = 500,
    [string]$OutputFile = "",
    [string]$BaseDir = ""
)

# Colors for output (PowerShell)
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Get script directory and project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Set defaults if not provided
if ([string]::IsNullOrEmpty($BaseDir)) {
    $BaseDir = $ProjectRoot
}
if ([string]::IsNullOrEmpty($OutputFile)) {
    $OutputFile = Join-Path $ProjectRoot "code_dump.txt"
}

# Convert to absolute paths
$BaseDir = [System.IO.Path]::GetFullPath($BaseDir)
$OutputFile = [System.IO.Path]::GetFullPath($OutputFile)

# Validate directory exists
if (-not (Test-Path $BaseDir -PathType Container)) {
    Write-ColorOutput "Error: Directory not found: $BaseDir" "Yellow"
    exit 1
}

Write-ColorOutput "=== Astro Code Concatenation Script ===" "Cyan"
Write-Host "Base directory: $BaseDir"
Write-Host "Output file: $OutputFile"
Write-Host "Include tests: $IncludeTests"
Write-Host "Include docs: $IncludeDocs"
Write-Host "Include HTML: $IncludeHtml"
Write-Host "Include locales: $IncludeLocales"
Write-Host "Max file size: ${MaxSizeKB}KB"
Write-Host ""

# Directories to exclude
$ExcludeDirs = @(
    "node_modules",
    ".git",
    ".next",
    "dist",
    "dist-ssr",
    ".astro",
    "build",
    "vendor",
    ".cache",
    "coverage",
    ".coverage",
    "htmlcov",
    ".pytest_cache",
    ".nyc_output",
    "test-results",
    "playwright-report",
    "playwright",
    ".turbo",
    ".vercel",
    "out",
    ".svelte-kit",
    "storybook-static",
    ".pnpm-store",
    ".yarn",
    "__pycache__",
    ".mypy_cache",
    ".tox",
    ".nox",
    ".hypothesis",
    ".pyre",
    ".pytype",
    "cython_debug",
    ".terraform",
    ".gcloud",
    ".idea",
    ".vscode",
    ".scrapy",
    ".ipynb_checkpoints",
    ".sentry",
    "tmp",
    "temp",
    ".tmp",
    ".temp"
)

# Function to check if file should be excluded
function Should-ExcludeFile {
    param([string]$FilePath)
    
    $FileName = Split-Path -Leaf $FilePath
    
    # Check if in excluded directory
    foreach ($ExcludeDir in $ExcludeDirs) {
        if ($FilePath -like "*\$ExcludeDir\*" -or $FilePath -like "*/$ExcludeDir/*") {
            return $true
        }
    }
    
    # Exclude test files if not including tests
    if (-not $IncludeTests) {
        if ($FileName -match '\.(test|spec)\.(ts|tsx|js|jsx)$' -or
            $FilePath -like '*\__tests__\*' -or
            $FilePath -like '*\tests\*' -or
            $FilePath -like '*\test\*' -or
            $FilePath -like '*/__tests__/*' -or
            $FilePath -like '*/tests/*' -or
            $FilePath -like '*/test/*') {
            return $true
        }
    }
    
    # Exclude HTML files if not including HTML
    if (-not $IncludeHtml -and $FilePath -like "*.html") {
        return $true
    }
    
    # Exclude locale JSON files if not including locales
    if (-not $IncludeLocales -and ($FilePath -like "*\locales\*.json" -or $FilePath -like "*/locales/*.json")) {
        return $true
    }
    
    return $false
}

# Function to get file type
function Get-FileType {
    param([string]$FilePath)
    
    $FileName = Split-Path -Leaf $FilePath
    $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    switch ($Extension) {
        ".astro" { return "Astro" }
        ".ts" {
            if ($FilePath -match '\.(test|spec)\.ts$') {
                return "TypeScript Test"
            }
            return "TypeScript"
        }
        ".tsx" {
            if ($FilePath -match '\.(test|spec)\.tsx$') {
                return "TypeScript React Test"
            }
            return "TypeScript React"
        }
        ".js" {
            if ($FilePath -match '\.(test|spec)\.js$') {
                return "JavaScript Test"
            }
            return "JavaScript"
        }
        ".jsx" {
            if ($FilePath -match '\.(test|spec)\.jsx$') {
                return "JavaScript React Test"
            }
            return "JavaScript React"
        }
        ".mjs" { return "JavaScript Module" }
        ".cjs" { return "JavaScript CommonJS" }
        ".md" { return "Markdown" }
        ".mdx" { return "Markdown" }
        ".json" {
            if ($FileName -eq "package.json") { return "Package Config" }
            if ($FileName -match "^(package-lock|yarn\.lock|pnpm-lock)") { return "Lock File" }
            if ($FileName -like "tsconfig*.json") { return "TypeScript Config" }
            if ($FilePath -like "*\locales\*.json" -or $FilePath -like "*/locales/*.json") { return "Locale JSON" }
            return "JSON"
        }
        ".html" { return "HTML" }
        ".css" { return "CSS" }
        ".yml" {
            if ($FilePath -like "*\.github\workflows\*") { return "GitHub Workflow" }
            return "YAML"
        }
        ".yaml" {
            if ($FilePath -like "*\.github\workflows\*") { return "GitHub Workflow" }
            return "YAML"
        }
        ".sh" { return "Shell Script" }
    }
    
    # Config files by name
    if ($FileName -like "astro.config.*") { return "Astro Config" }
    if ($FileName -like "vite.config.*") { return "Vite Config" }
    if ($FileName -like "tailwind.config.*") { return "Tailwind Config" }
    if ($FileName -like "playwright.config.*") { return "Playwright Config" }
    if ($FileName -like "postcss.config.*") { return "PostCSS Config" }
    if ($FileName -like "Dockerfile*") { return "Docker" }
    if ($FileName -like "docker-compose*.yml" -or $FileName -like "docker-compose*.yaml") { return "Docker Compose" }
    if ($FileName -like ".env.example*" -or $FileName -like "*.env.example") { return "Environment Example" }
    if ($FileName -like ".prettierrc*" -or $FileName -like "prettier.config.*") { return "Prettier Config" }
    if ($FileName -like ".eslintrc.*" -or $FileName -like "eslint.config.*") { return "ESLint Config" }
    if ($FileName -eq "Makefile") { return "Makefile" }
    
    return "Unknown"
}

# Function to get comment prefix
function Get-CommentPrefix {
    param([string]$FilePath)
    
    $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    switch ($Extension) {
        { $_ -in @(".astro", ".html", ".md", ".mdx") } { return "<!--" }
        ".css" { return "/*" }
        { $_ -in @("", ".sh") -or (Split-Path -Leaf $FilePath) -eq "Dockerfile" -or (Split-Path -Leaf $FilePath) -eq "Makefile" } { return "#" }
        default { return "//" }
    }
}

# Function to get comment suffix
function Get-CommentSuffix {
    param([string]$FilePath)
    
    $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    switch ($Extension) {
        { $_ -in @(".astro", ".html", ".md", ".mdx") } { return "-->" }
        ".css" { return "*/" }
        default { return "" }
    }
}

# Collect files
$Files = @()

Write-ColorOutput "Finding Astro files..." "Cyan"
$Files += Get-ChildItem -Path $BaseDir -Filter "*.astro" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Should-ExcludeFile $_.FullName) } |
    ForEach-Object { $_.FullName }

Write-ColorOutput "Finding TypeScript/JavaScript files..." "Cyan"
$Files += Get-ChildItem -Path $BaseDir -Include @("*.ts", "*.tsx", "*.js", "*.jsx", "*.mjs", "*.cjs") -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Should-ExcludeFile $_.FullName) } |
    ForEach-Object { $_.FullName }

if ($IncludeDocs) {
    Write-ColorOutput "Finding Markdown files..." "Cyan"
    $Files += Get-ChildItem -Path $BaseDir -Include @("*.md", "*.mdx") -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { -not (Should-ExcludeFile $_.FullName) } |
        ForEach-Object { $_.FullName }
}

if ($IncludeHtml) {
    Write-ColorOutput "Finding HTML files..." "Cyan"
    $Files += Get-ChildItem -Path $BaseDir -Filter "*.html" -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { -not (Should-ExcludeFile $_.FullName) } |
        ForEach-Object { $_.FullName }
}

Write-ColorOutput "Finding CSS files..." "Cyan"
$Files += Get-ChildItem -Path $BaseDir -Filter "*.css" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { -not (Should-ExcludeFile $_.FullName) } |
    ForEach-Object { $_.FullName }

Write-ColorOutput "Finding JSON files..." "Cyan"
$Files += Get-ChildItem -Path $BaseDir -Filter "*.json" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        -not (Should-ExcludeFile $_.FullName) -and
        $_.Name -notmatch "^(package-lock|yarn\.lock|pnpm-lock)" -and
        $_.Name -notlike "*.lock.json"
    } |
    ForEach-Object { $_.FullName }

Write-ColorOutput "Finding configuration files..." "Cyan"

# Configuration files
$ConfigPatterns = @(
    "package.json",
    "astro.config.*",
    "vite.config.*",
    "tailwind.config.*",
    "postcss.config.*",
    "tsconfig*.json",
    "Dockerfile*",
    "docker-compose*.yml",
    "docker-compose*.yaml",
    ".env.example*",
    "*.env.example",
    ".prettierrc*",
    "prettier.config.*",
    ".eslintrc.*",
    "eslint.config.*",
    "Makefile",
    "*.sh"
)

if ($IncludeTests) {
    $ConfigPatterns += "playwright.config.*"
}

foreach ($Pattern in $ConfigPatterns) {
    $Files += Get-ChildItem -Path $BaseDir -Filter $Pattern -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { -not (Should-ExcludeFile $_.FullName) } |
        ForEach-Object { $_.FullName }
}

# GitHub workflows
$Files += Get-ChildItem -Path $BaseDir -Filter "*.yml" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\.github\workflows\*" -or $_.FullName -like "*/.github/workflows/*" } |
    ForEach-Object { $_.FullName }

$Files += Get-ChildItem -Path $BaseDir -Filter "*.yaml" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\.github\workflows\*" -or $_.FullName -like "*/.github/workflows/*" } |
    ForEach-Object { $_.FullName }

if ($IncludeDocs) {
    Write-ColorOutput "Finding documentation files..." "Cyan"
    $Files += Get-ChildItem -Path $BaseDir -Filter "README.md" -Recurse -File -ErrorAction SilentlyContinue |
        ForEach-Object { $_.FullName }
    
    if (Test-Path (Join-Path $BaseDir "docs")) {
        $Files += Get-ChildItem -Path (Join-Path $BaseDir "docs") -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue |
            ForEach-Object { $_.FullName }
    }
}

# Remove duplicates and filter excluded directories
$Files = $Files | 
    Where-Object {
        $File = $_
        $ShouldExclude = $false
        foreach ($ExcludeDir in $ExcludeDirs) {
            if ($File -like "*\$ExcludeDir\*" -or $File -like "*/$ExcludeDir/*") {
                $ShouldExclude = $true
                break
            }
        }
        -not $ShouldExclude
    } |
    Sort-Object -Unique

$FileCount = $Files.Count

if ($FileCount -eq 0) {
    Write-ColorOutput "Warning: No files found" "Yellow"
    exit 1
}

Write-Host "Found $FileCount files"
Write-Host ""

# Create output file with header
$Header = @"
// ============================================================================
// Code Dump for AI Agent Review - Astro/Tailwind Project
// ============================================================================
// Base directory: $BaseDir
// Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
// Files found: $FileCount
// Options: include-tests=$IncludeTests, include-docs=$IncludeDocs, include-html=$IncludeHtml, include-locales=$IncludeLocales, max-size=${MaxSizeKB}KB
// ============================================================================

"@

Set-Content -Path $OutputFile -Value $Header -Encoding UTF8

# Process each file
$CurrentFile = 0
$IncludedFileCount = 0
$ExcludedSizeCount = 0

foreach ($FilePath in $Files) {
    $CurrentFile++
    
    # Get relative path from base directory
    $RelPath = $FilePath.Replace($BaseDir, "").TrimStart("\", "/")
    
    # Check file size
    if ($MaxSizeKB -gt 0) {
        $FileInfo = Get-Item $FilePath -ErrorAction SilentlyContinue
        if ($null -ne $FileInfo) {
            $FileSizeKB = [math]::Round($FileInfo.Length / 1KB, 2)
            if ($FileSizeKB -gt $MaxSizeKB) {
                Write-ColorOutput "[$CurrentFile/$FileCount] Skipping large file (${FileSizeKB}KB > ${MaxSizeKB}KB): $RelPath" "Yellow"
                $ExcludedSizeCount++
                continue
            }
        }
    }
    
    $FileType = Get-FileType $FilePath
    $CommentPrefix = Get-CommentPrefix $FilePath
    $CommentSuffix = Get-CommentSuffix $FilePath
    
    Write-ColorOutput "[$CurrentFile/$FileCount] Adding $FileType : $RelPath" "Green"
    $IncludedFileCount++
    
    # Add file separator
    if ($CommentSuffix) {
        $Separator = @"

$CommentPrefix ============================================================================$CommentSuffix
$CommentPrefix FILE: $RelPath$CommentSuffix
$CommentPrefix Type: $FileType$CommentSuffix
$CommentPrefix ============================================================================$CommentSuffix

"@
    } else {
        $Separator = @"

$CommentPrefix ============================================================================
$CommentPrefix FILE: $RelPath
$CommentPrefix Type: $FileType
$CommentPrefix ============================================================================

"@
    }
    
    Add-Content -Path $OutputFile -Value $Separator -Encoding UTF8
    
    # Add file content
    try {
        $Content = Get-Content -Path $FilePath -Raw -Encoding UTF8 -ErrorAction Stop
        Add-Content -Path $OutputFile -Value $Content -Encoding UTF8 -NoNewline
        Add-Content -Path $OutputFile -Value "`n" -Encoding UTF8 -NoNewline
    } catch {
        Write-ColorOutput "  Warning: Could not read file: $FilePath" "Yellow"
        Add-Content -Path $OutputFile -Value "// Error: Could not read file content`n" -Encoding UTF8
    }
}

# Add footer
$Footer = @"

// ============================================================================
// End of Code Dump
// Total files found: $FileCount
// Total files included: $IncludedFileCount
// Files excluded due to size: $ExcludedSizeCount
// Files excluded due to filters: $($FileCount - $IncludedFileCount - $ExcludedSizeCount)
// ============================================================================
"@

Add-Content -Path $OutputFile -Value $Footer -Encoding UTF8

Write-Host ""
Write-ColorOutput "✓ Successfully concatenated $IncludedFileCount files to $OutputFile" "Green"
Write-ColorOutput "  (Found $FileCount total, excluded $($FileCount - $IncludedFileCount) due to filters and size limits)" "Green"
