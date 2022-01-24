for (( i=1; i<=151; i+=10 ))
do
   max=$(($i + 10))
   if [ $max -gt 152 ]; then
   max=152
   fi
   node populateDB/pokemon.js --min=$i --max=$max
done