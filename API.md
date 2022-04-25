<h1> Eviction Tracker API </h1>

<p>Based on the GET principle, the Eviction Tracker API endpoints return JSON eviction data on cases, buildings, filings by tract daily, filings by tract monthly, filings by county weekly and filings by county monthly. The API provides a set of endpoints, each with it's own path.</p>

<h2>Base URL</h2>

<p><code>https://metroatlhousing.org/atlanta-region-eviction-tracker/rest</code></p>

<h2>Endpoints</h2>

<h3><code>/cases</code></h3>

<p>GET case level data for the metro Atlanta area</p>

<h3>API call</h3>

<p><code>
https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/cases?apiKey={API Key}</code></p>

<h4><strong>Parameters</strong></h4>

<table>
<tr></tr>
<tr>
<td>apiKey</td>
<td>Required</td>
<td>Your unique API Key. If you do not have an API key please visit the <a href="#request-api-key">Request API Key section below.</a></td>
</tr>
<tr>
<td>fileDate</td>
<td>Required*</td>
<td>A specific date or range of dates in the MM/DD/YYYY format (e.g., fileDate=01/01/2022). <strong>Date ranges</strong> need to begin with a start date, followed by a "-", and end with the end date (e.g., fileDate=01/01/2022-01/31/2022). Most API keys <strong>require</strong> a fileDate parameter to receive a response unless your API key permits global access or a year parameter is being used.</td>
</tr>
<tr>
<td>county</td>
<td>Required*</td>
<td>The last three digits of a county FIPS code (e.g., county=121 will query Fulton County). Most API keys <strong>require</strong> a county code parameter to receive a response unless your API key permits global access or a more specific parameter is added to the call (e.g.: city, zip, tractID or blockGroupID).</td>
</tr>
<tr>
<td>year</td>
<td>Optional</td>
<td>A specific year in the YYYY format (e.g., year=2022). Cannot be combined with a dateRange parameter. A year parameter will be <strong>required</strong> if you do not have global access or you are not using a dateRange parameter in your query.</td>
</tr>
<tr>
<td>city</td>
<td>Optional</td>
<td>A specific city in all lowercase characters (e.g., city=atlanta).</td>
</tr>
<tr>
<td>zip</td>
<td>Optional</td>
<td>A specific zip code.</td>
</tr>
<tr>
<td>tractID</td>
<td>Optional</td>
<td>A specific census tract ID.</td>
</tr>
<tr>
<td>blockGroupID</td>
<td>Optional</td>
<td>A specific census block group ID.</td>
</tr>
</table>
<p>* API keys with global access do not require this parameter</p>

<!-- ### Building a Query

Depending on permissions given on your API key, you will be required to build out a query in order to get back a JSON response. To build out your query you will add fields with values onto the end of your URL.

_Note: Unless granted global permissions, you will be required to enter a date AND a county id, city name, or tract id_.

Examples:

```
/cases?apiKey=[Your API Key]&county=121&fileDate=04/01/2019
```

```
/cases?apiKey=[Your API Key]&city=atlanta&fileDate=07/19/2020-07/29/2020
```

```
/cases?apiKey=[Your API Key]&tractID=13063040202&year=2022
```

\*Replace [Your API Key] with your provided API key

Once you have at least those two fields being queried you may add additional fields to narrow your search.

Example:

```
/cases?apiKey=[Your API Key]&county=121&fileDate=04/01/2019-04/31/2019&city=atlanta&caseStatus=Disposed
```

### Boolean Value Queries

The following fields can be added on to your query and take a 0 or a 1 as values: answer, services, dismiss, defaultJudgment and judgment

0 = False

1 = True

Examples:

```
/cases?apiKey=[Your API Key]&county=121&fileDate=04/01/2019-04/31/2019&judgment=1
```

```
/cases?apiKey=[Your API Key]&county=121&fileDate=03/01/2022-03/31/2022&answer=0
```

\*Replace [Your API Key] with your provided API key

---

### `/tractdaily`

An API Key is not required for this endpoint. You may make a request without a query added to your URL.

### Building a Query

Add a query, or multiple queries, to the end or your URL to narrow your search.

Examples:

```
/tractdaily?FilingDate=04/01/2021
```

```
/tractdaily?TractID=13135050421
```

```
/tractdaily?Year=2021&CountyID=067
```

```
/tractdaily?FilingDate=04/01/2020-04/31/2020&CountyID=121
```

---

### `/tractbymonth`

An API Key is not required for this endpoint. You may make a request without a query added to your URL.

### Building a Query

Add a query to the end or your URL to narrow your search.

Examples:

```
/tractbymonth?TractID=13135050719
```

```
/tractbymonth?CountyID=135
```

---

### `/countyweekly`

An API Key is not required for this endpoint. You may make a request without a query added to your URL.

### Building a Query

Add a query, or multiple queries, to the end or your URL to narrow your search.

Examples:

```
/countyweekly?FilingWeek=02/27/2022
```

```
/countyweekly?CountyID=135&FilingWeek=01/01/2020-01/31/2020
```

```
/countyweekly?CountyID=135&Year=2020
```

---

### `/countymonthly`

An API Key is not required for this endpoint. You may make a request without a query added to your URL.

### Building a Query

Add a query, or multiple queries, to the end or your URL to narrow your search.

Examples:

```
/countymonthly?FilingMonth=02/01/2022
```

```
/countymonthly?CountyID=121&FilingMonth=01/01/2021-03/01/2021
```

```
/countyweekly?CountyID=135&Year=2020
```

---

### `/buildings`

An API Key is not required for this endpoint. You may make a request without a query added to your URL.

### Building a Query

Add a query, or multiple queries, to the end or your URL to narrow your search.

Examples:

```
/buildings?county=063
```

```
/buildings?tractid=13135050417
```

```
/buildings?city=norcross
```

---

## Date Queries

Our database collections that contain a filing date field can be queried on these dates in three different ways.

_Date Format: MM/DD/YYYY_

_Year Format: YYYY_

---

### Filing Date

A filing date query must contain one single date in the correct date format (MM/DD/YYY).

Cases:

```
/cases?apiKey=[Your API Key]&fileDate=01/01/2022
```

\*Replace [Your API Key] with your provided API key

Filings By Tract Daily:

```
/tractdaily?FilingDate=01/02/2019
```

Filings By County Weeks:

```
/countyweekly?FilingWeek=02/27/2022
```

Filings By County Months:

```
/countymonthly?FilingMonth=02/01/2022
```

---

### Date Range

A date range query must have two separate dates, in the correct date format (MM/DD/YYY) and separated by a '-'. The first date represents the start date. The second date represents the end date.

Cases:

```
/cases?apiKey=[Your API Key]&fileDate=01/01/2022-01/31/2022
```

\*Replace [Your API Key] with your provided API key

Filings By Tract Daily:

```
/tractdaily?FilingDate=01/01/2022-01/31/2022
```

Filings By County Weeks:

```
/countyweekly?FilingWeek=01/01/2022-01/31/2022
```

Filings By County Months:

```
/countymonthly?FilingMonth=01/01/2022-01/31/2022
```

---

### Year

A year query must have one single year in the correct year format (YYYY).

Cases:

```
/cases?apiKey=[Your API Key]&year=2022
```

\*Replace [Your API Key] with your provided API key

Filings By Tract Daily:

```
/tractdaily?Year=2022
```

Filings By County Weeks:

```
/countyweekly?Year=2022
```

Filings By County Months:

```
/countymonthly?Year=2022
```

---

## Optional Queries

Along with being able to query any field present on a document by adding the query to the URL. You may also add a few additional queries to better your search.

---

## Sort

A sort query can be added to your request to receive a response of documents that are sorted in either ascending or descending order by filing date, week or month.

Notes:

- The sort query will be lowercase for all endpoints: _sort=asc_ or _sort=desc_
- If added to an endpoint that leads to a collection without a filing date, week or month, the response will not be sorted

Ascending Sort:

```
/countyweekly?CountyID=067&sort=asc
```

Descending Sort:

```
/cases?apiKey=[Your API Key]&county=067&fileDate=01/01/2021-01/31/2021&sort=desc
```

\*Replace [Your API Key] with your provided API key

---

### Limit

A limit query can be added to any endpoint to limit the amount of documents sent back in the response.

Notes:

- If your _cases_ API key has a preset limit, your response will never be longer than that limit.
- Limiting results can help performance when requesting large amounts of data

Example:

```
/cases?apiKey=[Your API Key]&county=067&year=2019&limit=10000
```

\*Replace [Your API Key] with your provided API key

## Make a Request

All requests will have the same formula when making a request:

1. [The Base URL](#base-url)
2. The API you wish to make a request to
3. Your API key (if applicable)
4. Your query (if applicable)

### Web Browser

Since all requests are GET requests, you can get responses in your web browser. To make a GET request in your web browser, just type in your constructed URL into your browser like you would when visiting a website.

Notes: When making a request [the base URL](#base-url) will go in front of your constructed url

```

https://metroatlhousing.org/atlanta-region-eviction-tracker/rest/cases?apiKey=[Your API Key]&year=2020&county=067&limit=1000

``` -->

## Request API Key

```

```
