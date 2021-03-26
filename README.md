# coesite
vector tile server (onyx with Azure AD authentication for actual use)  
Based on azure-onyx3  

## install
```console
git clone git@github.com:un-vector-tile-toolkit/coesite
cd coesite
npm install
(edit config, store data, etc..)
npm start
```

## URL request to vector tiles
https://xxxx/vtiles-s/zxy/{t}/{z}/{x}/{y}.pbf (single zoom level modules)  
https://xxxx/vtiles-m/zxy/{t}/{z}/{x}/{y}.pbf (multiple zoom level modules)  
https://xxxx/vtiles-open/zxy/{t}/{z}/{x}/{y}.pbf (without AccessToken)

## URL request to raster
As the default, it is turned off. edit app.js, routes/plow and routes/plow-open.    
https://xxxx/plow/raster/{z}/{x}/{y}.png (raster tile)  
https://xxxx/plow-open/raster/{z}/{x}/{y}.png (raster tile without access token)  
Note: if you use RHEL or CentOS, playwright may not work due to the missing libraries. Please check them and install necessary packages.  

## See also  
https://docs.microsoft.com/en-us/graph/tutorials/node?WT.mc_id=Portal-Microsoft_AAD_RegisteredApps&tutorial-step=3  



