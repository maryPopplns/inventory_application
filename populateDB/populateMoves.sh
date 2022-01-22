for (( i=1; i<=161; i+=10 ))
do
   max=$(($i + 10))
   if [ $max -gt 166 ]; then
   max=166
   fi
   node populateDB/moves.js --min=$i --max=$max
done