<script setup>
const items = [
  {
    id: 1,
    head: 'Total Devices (Today)',
    number: '75,928',
    percent: '9.8%',
    image: '/images/devices.png',
  },
  {
    id: 2,
    head: 'Active Devices',
    number: '15,743',
    percent: '5.9%',
    image: '/images/devices.png',
  },
  {
    id: 3,
    head: 'Registered Areas',
    number: '463',
    percent: '5.9%',
    image: '/images/pins.png',
  },
  {
    id: 4,
    head: 'Total Users',
    number: '53,923',
    percent: '5.9%',
    image: '/images/people.png',
  }
]

const items_2 = [
  {
    id: 1,
    head: 'New Users (Today)',
    number: '85',
    percent: '5.9%',
  },
  {
    id: 2,
    head: 'New Devices (Today)',
    number: '64',
    percent: '5.9%',
  },
  {
    id: 3,
    head: 'Total Alerts (Today)',
    number: '25,743',
    percent: '5.9%',
  },
]
</script>

<template>
    <div>
    <div class="title-bar">
        <a> Dashboard </a>
    </div>

    <div class="content-bar">
        <div class="search-bar">
            <div class="box">
            <div class="search-button" :style="{width: '447px'}">
                <a> School </a>
            </div>
            <div class="search-button" :style="{width: '257px'}">
                <a> Time </a>
            </div>
            <div class="button">
                <a> Export </a>
            </div>
            </div>
            <div class="updated-time">
                <a> Updated 15s ago </a>
            </div>
        </div>
        <div class="card-bar">
            <div v-for="item in items" :key="item.id" class="card" :style="{height: '201px', width: '266px'}">
                <img class="image" :src="item.image" />
                <a class="head"> {{ item.head }} </a>
                <a class="number"> {{ item.number }} </a>
                <div class="percent"> <span :style="{ color: '#2AA937' }"> {{ item.percent }} </span> from last month </div>
            </div>
        </div>
        <div class="card-bar">
            <div v-for="item in items_2" :key="item.id" class="card" :style="{height: '153px', width: 'calc(50% - 12px)', flexDirection: 'row', alignItems: 'center'}">
                <div class="fake-icon" :style="{width: '95px', height: '95px'}"> </div> 
                <div :style="{display: 'flex', flexDirection: 'column', gap: '8px'}">
                    <a class="head"> {{ item.head }} </a>
                    <a class="number"> {{ item.number }} </a>
                    <div class="percent"> <span :style="{ color: '#2AA937' }"> {{ item.percent }} </span> from last month </div>
                </div>
            </div>
        </div>
        <div class="card" :style="{height: '397px', width: '556px'}">
        </div>
    </div>
    </div>
</template>

<style scoped>

* {
    font-family: 'Noto Sans', sans-serif;
    gap: 24px;
}

.image {
    width: 32px;
    height: 32px;
}

.updated-time {
    font-size: 12px;
    color: #B9B9B9;
}

.three-cards {
    display: flex;
    flex-direction: row;
}

.box {
    display: flex;
    flex-direction: row;
    gap: 16px;

}

.head {
    color: #848484;
    font-size: 16px;
    font-weight: bold;
}

.number {
    font-size: 32px; 
    font-weight: bold;
}

.percent {
    color: #848A90;
    font-size: 14px;
}

.card {
    background-color: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
}

.card-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
}

.content-bar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    padding: 24px;
    width: 100%;
}

.search-bar {
    align-items: center;
    justify-content: space-between;
    background-color: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 16px;
    display: flex;
    gap: 16px;
    height: 88px;
    padding: 24px;
}

.button {
    align-items: center;
    background-color: #0198FF;
    color: #FFFFFF;
    font-weight: bold;
    justify-content: center;
    border: 0px;
    display: flex;
    width: 102px;
}

.search-button {
    display: flex;
    align-items: center;
    padding: 10.5px;
}

.search-button, .button  {
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    height: 40px;
}

.title-bar {
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid #E5E7EB;
    display: flex;
    height: 82px;
    padding: 24px;
    width: 100%;
    font-size: 36px;
    font-family: 'Noto Sans', sans-serif;
    font-weight: bold;
}
</style>