# eval

## Description
The `eval` command calculates an expression and puts the resulting value into a search results field.
* If the field name that you specify does not match a field in the output, a new field is added to the search results.
* If the field name that you specify matches a field name that already exists in the search results, the results of the eval expression overwrite the values in that field.

The `eval` command evaluates mathematical, string, and boolean expressions.

You can chain multiple eval expressions in one search using a comma to separate subsequent expressions. The search processes multiple eval expressions left-to-right and lets you reference previously evaluated fields in subsequent expressions.

## Syntax
eval &lt;field&gt;=&lt;expression&gt;["," &lt;field&gt;=&lt;expression&gt;]...

### Required arguments
<b>field</b>   
<b>Syntax:</b> &lt;string&gt;  
<b>Description:</b> A destination field name for the resulting calculated value. If the field name already exists in your events, eval overwrites the value.    
 
<b>expression</b>  
<b>Syntax:</b> &lt;string&gt;    
<b>Description:</b> A combination of values, variables, operators, and functions that will be executed to determine the value to place in your destination field.
The eval expression is case-sensitive. The syntax of the eval expression is checked before running the search, and an exception is thrown for an invalid expression.
* The result of an eval expression cannot be a Boolean.
* If, at search time, the expression cannot be evaluated successfully for a given event, the `eval` command erases the resulting field.
* If the expression references a <b>field name</b> that contains non-alphanumeric characters, other than the underscore ( _ ) character, the field name needs to be surrounded by <b>single quotation marks</b>. For example, if the field name is `server-1` you specify the field name like this `new=count+'server-1'`.
* If the expression references a literal string, that string needs to be surrounded by <b>double quotation marks</b>. For example, if the string you want to use is `server-` you specify the string like this `new="server-".host`.

## Usage
The `eval` command is a distributable streaming command.

### General
You must specify a field name for the results that are returned from your `eval` command expression. You can specify a name for a new field or for an existing field.

:::info
If the field name that you specify matches an existing field name, the values in the existing field are replaced by the results of the eval expression.
:::

Numbers and strings can be assigned to fields, while booleans cannot be assigned. However you can convert booleans and nulls to strings using the `tostring()` function, which can be assigned to fields.

If you are using a search as an argument to the `eval` command and functions, you cannot use a saved search name; you must pass a literal search string or a field that contains a literal search string (like the 'search' field extracted from index=_audit events).

### Numeric calculations
During calculations, numbers are treated as double-precision floating-point numbers, subject to all the usual behaviors of floating point numbers. If the calculation results in the floating-point special value NaN(Not a Number), it is represented as "nan" in your results. The special values for positive and negative infinity are represented in your results as "inf" and "-inf" respectively. Division by zero results in a null field.

#### Rounding
Results are rounded to a precision appropriate to the precision of the input results. The precision of the results can be no greater than the precision of the least-precise input. For example, the following search has different precision for `0.2` in each of the calculations based on the number of zeros following the number 2:

```
|makeresults 
| eval decimal1=8.250 * 0.2, decimal2=8.250 * 0.20, decimal3=8.250 * 0.200, 
  exact=8.250 * exact(0.2)
```

#### Long numbers
There are situations where the results of a calculation contain more digits than can be represented by a floating- point number. In those situations precision might be lost on the least significant digits. The limit to precision is 17 significant digits, or `-253 +1` to `253 -1`.

#### Significant digits
If a result returns a long number with more digits than you want to use, you can specify the number of digits to return using the `sigfig` function.

### Operators
The following table lists the basic operations you can perform with the `eval` command. For these evaluations to work, the values need to be valid for the type of operation. For example, with the exception of addition, arithmetic operations might not produce valid results if the values are not numerical. When concatenating values, Splunk software reads the values as strings, regardless of the value.

| Type           | Operators                          |
| -------------- | ---------------------------------- |
| Arithmetic     | `+ - * / %  `                        |
| Concatenation  | `.`                                  |
| Boolean        | `AND OR NOT XOR < > <= >= != = == LIKE` |

#### Operators that produce numbers
* The plus ( + ) operator accepts two numbers for addition, or two strings for concatenation.
* The subtraction ( - ), multiplication ( * ), division ( / ), and modulus ( % ) operators accept two numbers.

#### Operators that produce strings
* The period ( . ) operator concatenates both strings and number. Numbers are concatenated in their string represented form.

#### Operators that produce booleans
* The AND, OR, and XOR operators accept two Boolean values.
* The `<`, `>`, `<=`, `>=`, `!=`, `=`, and `==` operators accept two numbers or two strings.
In expressions, the single equal sign ( = ) is a synonym for the double equal sign ( `==` ).
* The LIKE operator accepts two strings. This is a pattern match similar to what is used in SQL. For example `string LIKE pattern`. The pattern operator supports literal text, a percent ( % ) character for a wildcard, and an underscore ( _ ) character for a single character match. For example, field `LIKE "a%b_"` matches any string starting with `a`, followed by anything, followed by `b`, followed by one character.

## Basic Examples
#### 1. Create a new field that contains the result of a calculation
Create a new field called `velocity` in each event. Calculate the velocity by dividing the values in the distance field by the values in the time field.

```
... | eval velocity=distance/time
```
#### 2. Use the if function to analyze field values
Create a field called `error` in each event. Using the `if` function, set the value in the `error` field to OK if the `status` value is 200. Otherwise set the `error` field value to Problem.

```
... | eval error = if(status == 200, "OK", "Problem")
```

#### 3. Convert values to lowercase
Create a new field in each event called `low-user`. Using the `lower` function, populate the field with the lowercase version of the values in the `username` field.

```
... | eval low-user = lower(username)
```

4. Use the value of one field as the name for a new field
In this example, use each value of the field `counter` to make a new field name. Assign to the new field the value of the `Value` field.

```
index=perfmon sourcetype=Perfmon* counter=* Value=* | eval {counter} = Value
```

#### 5. Set sum_of_areas to be the sum of the areas of two circles

```
... | eval sum_of_areas = pi() * pow(radius_a, 2) + pi() * pow(radius_b, 2)
```
