# @ng-address/cli

> Developer CLI for Nigerian address lookup, offline validation, normalization, and administrative exploration.

## Installation

```bash
# Run directly with npx
npx @ng-address/cli --help

# Or install globally
pnpm add -g @ng-address/cli
```

## Commands

### Interactive Guided Wizard
Run without arguments in a terminal to launch the interactive `@clack/prompts` assistant:
```bash
ng-address
```

### 1. NDAPS Postcode Lookup
Resolve digital alphanumeric postcodes or traditional numeric postcodes via NIPOST:
```bash
ng-address lookup LA-10-A01-LK-02
ng-address lookup LA-10-A01-LK-02 --json
```

### 2. Offline Address & Postcode Validation
Check address validity, state recognition, or postcode format without making network requests:
```bash
ng-address validate "Ikeja, Lagos"
ng-address validate 100001
ng-address validate --quiet "LA-10-A01-LK-02"
```

### 3. Normalization & Stdin Piping
Normalize free-text addresses or pipe input from other tools:
```bash
ng-address normalize "plot 10 admiralty way, lekki phase 1, lagos"
cat addresses.txt | ng-address normalize --compact
```

### 4. Administrative Browsing
List all 36 states + FCT or inspect official LGAs for any state:
```bash
ng-address list-states --zone "South West"
ng-address list-lgas "Lagos"
```
