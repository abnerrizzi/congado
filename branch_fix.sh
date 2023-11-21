##!/bin/bash


for t in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin/tags); do
 git tag ${t/origin\/tags\//} $t 
 git branch -D -r $t
done


for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin); do
 git branch ${b/origin\//} refs/remotes/$b
 git branch -D -r $b
done


# for p in $(git for-each-ref --format='%(refname:short)' | grep @); do
#  git branch -D $p
# done

