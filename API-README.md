# Eviction Tracker API

Based on simple REST principles, the Eviction Tracker API endpoints return JSON eviction data on cases, buildings, filings by tract daily, filings by tract monthly, filings by county weekly and filings by county monthly.

The API provides a set of endpoints, each with it's own path. Some of these endpoints will require an API Key in order to receive a response.

## Base URL

`https://metroatlhousing.org/atlanta-region-eviction-tracker/rest`

## Endpoints

---

### `/cases`

#### Add your _API Key_ (If you do not have an API please see the [Request API Key section below.](#request-api-key))

```
/cases?apiKey=[Your API Key]
```

\*Replace [Your API Key] with your provided API key

### Building a Query

Depending on permissions given on your API key, you will be required to build out a query in order to get back a JSON response. To build out your query you will add fields with values onto the end of your URL. Unless granted global permissions, you will be required to enter a date AND a county id, city name, or tract id.

Examples:

```
/cases?apiKey=[Your API Key]&county=121&fileDate=04/01/2019
```

```
/cases?apiKey=[Your API Key]&city=atlanta&fileDate=07/19/2020-07/29/2020
```

```
/cases?apiKey=[Your API Key]&tractID=13063040202&fileDate=01/01/2022
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

---

## Make a Request

## Request API Key
