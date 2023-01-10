/**
 * https://leetcode.com/problems/count-of-range-sum/description/
 *
 * Given an integer array nums and two integers lower and upper,
 * return the number of range sums that lie in [lower, upper] inclusive.
 *
 * Range sum S(i, j) is defined as the sum of the elements in nums
 * between indices i and j inclusive, where i <= j.
 */
function countRangeSum(nums: number[], lower: number, upper: number): number {
  // O(N2)
  const prevSums = getPrevSums(nums);
  const aux = new Array(nums.length);
  return processSums(prevSums, aux, 0, nums.length - 1, lower, upper);
}

function processSums(
  prevSums: number[],
  aux: number[],
  lo: number,
  hi: number,
  lower: number,
  upper: number,
): number {
  if (lo > hi) return 0;
  if (lo === hi) return prevSums[lo] >= lower && prevSums[lo] <= upper ? 1 : 0;

  const mid = (lo + hi) >>> 1;
  return (
    processSums(prevSums, aux, lo, mid, lower, upper) +
    processSums(prevSums, aux, mid + 1, hi, lower, upper) +
    merge(prevSums, aux, lo, mid, hi, lower, upper)
  );
}

function merge(
  prevSums: number[],
  aux: number[],
  lo: number,
  mid: number,
  hi: number,
  lower: number,
  upper: number,
): number {
  for (let i = lo; i <= hi; i++) {
    aux[i] = prevSums[i];
  }

  let windowL = lo,
    windowR = lo;
  let count = 0;
  for (let k = mid + 1; k <= hi; k++) {
    const min = aux[k] - upper,
      max = aux[k] - lower;
    while (windowL <= mid && aux[windowL] < min) {
      windowL++;
    }
    while (windowR <= mid && aux[windowR] <= max) {
      windowR++;
    }
    count += windowR - windowL;
  }

  let i = lo,
    j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    if (j > hi || (i <= mid && aux[i] <= aux[j])) {
      prevSums[k] = aux[i++];
    } else {
      prevSums[k] = aux[j++];
    }
  }

  return count;
}

function getPrevSums(nums: number[]): number[] {
  const prevSums = [];
  let sum = 0;
  for (let num of nums) {
    sum += num;
    prevSums.push(sum);
  }
  return prevSums;
}

// O(N^3)
function bf(nums: number[], lower: number, upper: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      const sum = sumRange(nums, i, j);
      if (sum >= lower && sum <= upper) {
        count++;
      }
    }
  }
  return count;
}

function sumRange(nums: number[], i: number, j: number): number {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += nums[k];
  }
  return sum;
}

function randomArray(n: number, min: number, max: number): number[] {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

function test() {
  // Time test
  let prevTotalTime = 0,
    totalTime = 0;
  const times = 1000;
  for (let N = 10; N <= Number.MAX_VALUE; N *= 2) {
    const min = -10000,
      max = 10000;
    const timeStart = Date.now();

    for (let i = 0; i < times; i++) {
      const arr = randomArray(N, min, max);
      let lower = Math.floor(Math.random() * (max - min + 1)) + min;
      let upper = Math.floor(Math.random() * (max - min + 1)) + min;
      lower = Math.min(lower, upper);
      upper = Math.max(lower, upper);

      // const expected = bf(arr, lower, upper);
      const actual = countRangeSum(arr, lower, upper);
      // if (expected !== actual) {
      //   console.assert(false, {
      //     arr,
      //     lower,
      //     upper,
      //     expected,
      //     actual,
      //   });
      //   return;
      // }
    }

    const timeEnd = Date.now();
    prevTotalTime = totalTime;
    totalTime = timeEnd - timeStart;
    console.log(`N: ${N}, time: ${totalTime}ms, prevTotalTime: ${prevTotalTime}ms`);
    const ratio = totalTime / prevTotalTime;
    const bigO = Math.log2(ratio);
    console.log(`ratio: ${ratio}, bigO: ${bigO}`);
  }
}

test();
