'use client'
import React from "react";
import styles from './preview.module.css'
import ServicePageComp from "@/components/ServicePage";
export default function Preview (props) {
    return (
        <div className={styles.container}>
            <ServicePageComp {...props} preview />
        </div>
    )
}