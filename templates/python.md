This project uses the following Python coding standards and conventions:

### Dependency Management
- Use `uv` for dependency management and running scripts.

### Naming Convention

- `snake_case` for variable and method names
- `PascalCase` for class names
- `UPPER_SNAKE_CASE` for constants
- `_async` suffix for asynchronous methods

### Best Practices
- All code should follow PEP 8 guidelines.
- Use meaningful variable and function names.
- Always use type hints for function signatures.
- Use f-strings for string formatting.

### Imports and exports

- Export all public classes and functions in `__init__.py` files.
  - Use `__all__` to define the public API.
- Use relative imports within the package.

### Testing
- Use `pytest` for writing and running tests.

